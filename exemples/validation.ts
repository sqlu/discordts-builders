/**
 * @file validation.ts
 * @description Shows runtime validation (toJSON throws) and non-blocking audit (auditTree).
 *
 * Run with:  bun run exemples/validation.ts
 */

import {
  ActionRowBuilder,
  BaseComponent,
  ButtonBuilder,
  ButtonStyle,
  ContainerBuilder,
  MessageFlags,
  TextDisplayBuilder,
} from '../src/index.ts';

console.log('=== Example 1: toJSON() validation ===\n');

try {
  const emptyContainer = new ContainerBuilder();
  emptyContainer.toJSON();
} catch (err) {
  console.error('Expected error from empty container:', (err as Error).message);
}

try {
  // @ts-expect-error
  new ButtonBuilder({
    customId: '',
    style: ButtonStyle.Primary,
    label: 'Click',
  });
} catch (err) {
  console.error('Expected error from empty customId:', (err as Error).message);
}

console.log('\n=== Example 2: auditTree() diagnostics ===\n');

const payload = {
  flags: MessageFlags.IsComponentsV2,
  components: [
    new ContainerBuilder()
      .addComponents(
        new TextDisplayBuilder({ content: 'Hello, world!' }),
        new ActionRowBuilder({
          components: [
            new ButtonBuilder({ customId: 'dup_id', style: ButtonStyle.Primary, label: 'Button A' }),
            new ButtonBuilder({ customId: 'dup_id', style: ButtonStyle.Secondary, label: 'Button B' }),
          ],
        }),
      )
      .toJSON(),
  ],
};

const warnings = BaseComponent.auditTree(payload);
if (warnings.length === 0) {
  console.log('✅ No issues found');
} else {
  console.log(`⚠️  Found ${warnings.length} issue(s):`);
  for (const w of warnings) {
    console.log(`  - ${w}`);
  }
}

console.log('\n=== Example 3: Structured audit (codes + paths) ===\n');

const structuredIssues = BaseComponent.auditTree(payload, { structured: true });
for (const issue of structuredIssues) {
  console.log(`[${issue.severity.toUpperCase()}] ${issue.code}`);
  console.log(`  Path : ${issue.path || '(root)'}`);
  console.log(`  Msg  : ${issue.message}`);
  console.log(`  Fix  : ${issue.fix}`);
  console.log('');
}
