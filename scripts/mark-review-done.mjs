import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const FEATURES_DIR = path.join(ROOT, 'docs', 'features');
const SCENES_PATH = path.join(ROOT, 'docs', '02-SCENES.md');
const CHANGELOG_PATH = path.join(ROOT, 'docs', '04-CHANGELOG.md');

const FEATURE_ID_PATTERN = /^F\d{3}$/i;

function parseArgs(argv) {
    const args = { featureId: null, dryRun: false };
    for (const arg of argv) {
        if (arg === '--dry-run') {
            args.dryRun = true;
            continue;
        }
        if (FEATURE_ID_PATTERN.test(arg)) {
            args.featureId = arg.toUpperCase();
        }
    }
    return args;
}

function listFeatureSpecs() {
    return fs
        .readdirSync(FEATURES_DIR)
        .filter((name) => /^F\d{3}-.+\.md$/.test(name))
        .map((name) => path.join(FEATURES_DIR, name));
}

function findSpecPath(featureId) {
    const normalizedId = featureId.toUpperCase();
    const match = listFeatureSpecs().find((filePath) =>
        path.basename(filePath).startsWith(`${normalizedId}-`),
    );
    if (!match) {
        throw new Error(`Không tìm thấy spec cho ${normalizedId} trong docs/features/`);
    }
    return match;
}

function findInProgressFeatureId() {
    for (const filePath of listFeatureSpecs()) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (/\*\*Trạng thái\*\*[^|]*\|\s*`in-progress`/i.test(content)) {
            const id = path.basename(filePath).slice(0, 4).toUpperCase();
            return id;
        }
    }
    throw new Error('Không có feature nào ở trạng thái in-progress. Truyền ID, ví dụ: npm run review:done -- F001');
}

function replaceSectionCheckboxes(content, sectionTitle, predicate = () => true) {
    const sectionRegex = new RegExp(`(## ${sectionTitle}[\\s\\S]*?)(?=\\n## |$)`);
    const match = content.match(sectionRegex);
    if (!match) {
        return { content, changed: 0 };
    }

    let changed = 0;
    const updatedSection = match[1].replace(/^- \[ \] (.+)$/gm, (line, label) => {
        if (!predicate(label, line)) {
            return line;
        }
        changed += 1;
        return `- [x] ${label}`;
    });

    return {
        content: content.replace(match[1], updatedSection),
        changed,
    };
}

function updateSpec(specPath) {
    let content = fs.readFileSync(specPath, 'utf8');
    const featureId = path.basename(specPath).slice(0, 4).toUpperCase();
    const updates = [];

    if (!/\*\*Trạng thái\*\*[^|]*\|\s*`done`/i.test(content)) {
        content = content.replace(
            /(\*\*Trạng thái\*\*[^|]*\|\s*)`[^`]+`/i,
            '$1`done`',
        );
        updates.push('Trạng thái → done');
    }

    const acceptance = replaceSectionCheckboxes(content, 'Acceptance criteria');
    content = acceptance.content;
    if (acceptance.changed > 0) {
        updates.push(`Acceptance criteria: tick ${acceptance.changed} mục`);
    }

    const plan = replaceSectionCheckboxes(content, 'Plan', (label) =>
        /human|play mode|playmode|editor/i.test(label),
    );
    content = plan.content;
    if (plan.changed > 0) {
        updates.push(`Plan: tick ${plan.changed} mục review`);
    }

    return { featureId, content, updates, specPath };
}

function updateScenes(featureId) {
    let content = fs.readFileSync(SCENES_PATH, 'utf8');
    const updates = [];

    const checklistRegex = /(## Checklist[\s\S]*?)(?=\n## |$)/;
    const match = content.match(checklistRegex);
    if (!match) {
        return { content, updates };
    }

    let changed = 0;
    const updatedChecklist = match[1].replace(/^- \[ \] (.+)$/gm, (line, label) => {
        if (!/play mode|onload|acceptance criteria|prefab/i.test(label)) {
            return line;
        }
        if (label.includes('acceptance criteria') && !label.includes(featureId)) {
            return line;
        }
        changed += 1;
        return `- [x] ${label}`;
    });

    if (changed > 0) {
        content = content.replace(match[1], updatedChecklist);
        updates.push(`02-SCENES checklist: tick ${changed} mục`);
    }

    return { content, updates };
}

function appendChangelog(featureId) {
    const today = new Date();
    const date = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, '0'),
        String(today.getDate()).padStart(2, '0'),
    ].join('-');
    const line = `| ${date} | ${featureId} | change: Human xác nhận Play mode / review | docs/features/${featureId}-*.md |`;

    const content = fs.readFileSync(CHANGELOG_PATH, 'utf8');
    if (content.includes(`| ${featureId} | change: Human xác nhận Play mode / review |`)) {
        return { content, updates: [] };
    }

    const marker = '|------|---------|----------|---------------|';
    if (!content.includes(marker)) {
        throw new Error('Không tìm thấy bảng lịch sử trong docs/04-CHANGELOG.md');
    }

    return {
        content: content.replace(marker, `${marker}\n${line}`),
        updates: ['CHANGELOG: thêm dòng review'],
    };
}

function writeOrDryRun(filePath, content, dryRun) {
    if (!dryRun) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

function main() {
    const { featureId: argFeatureId, dryRun } = parseArgs(process.argv.slice(2));
    const featureId = argFeatureId ?? findInProgressFeatureId();
    const specPath = findSpecPath(featureId);

    const specResult = updateSpec(specPath);
    const scenesResult = updateScenes(featureId);
    const changelogResult = appendChangelog(featureId);

    writeOrDryRun(specPath, specResult.content, dryRun);
    writeOrDryRun(SCENES_PATH, scenesResult.content, dryRun);
    writeOrDryRun(CHANGELOG_PATH, changelogResult.content, dryRun);

    const allUpdates = [...specResult.updates, ...scenesResult.updates, ...changelogResult.updates];
    const mode = dryRun ? '[dry-run] ' : '';

    console.log(`${mode}Đã xác nhận review cho ${featureId}`);
    console.log(`  Spec: ${path.relative(ROOT, specPath)}`);
    if (allUpdates.length === 0) {
        console.log('  (Không có thay đổi — có thể đã tick trước đó)');
    } else {
        for (const item of allUpdates) {
            console.log(`  - ${item}`);
        }
    }
    if (dryRun) {
        console.log('Chạy lại không có --dry-run để ghi file.');
    }
}

main();
