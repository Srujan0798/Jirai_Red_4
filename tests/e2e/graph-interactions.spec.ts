
import { test, expect } from '@playwright/test';

test.describe('Graph Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for canvas to be ready
    await page.waitForSelector('.react-flow__renderer');
  });

  test('should create node by double-clicking canvas', async ({ page }) => {
    const initialNodeCount = await page.locator('.react-flow__node').count();
    
    // Double-click on a blank area of the canvas
    // We use a specific position to avoid hitting existing nodes from initial state
    const canvas = page.locator('.react-flow__pane');
    await canvas.dblclick({ position: { x: 800, y: 600 }, force: true });
    
    // Allow small delay for state update and animation
    await page.waitForTimeout(500);
    
    // Verify node count increased by 1
    const newNodeCount = await page.locator('.react-flow__node').count();
    expect(newNodeCount).toBe(initialNodeCount + 1);
    
    // Verify the new node has the default title "New Topic"
    await expect(page.locator('.react-flow__node').last()).toContainText('New Topic');
  });

  test('should connect nodes by dragging handles', async ({ page }) => {
    // Ensure we have enough nodes to connect
    // Initial state has 3 nodes. Let's connect node 2 to node 3 (indexes 1 and 2)
    // Note: Handle selectors are tricky because they are small and often hidden
    
    // Force handles to be visible/interactive if they are hidden by CSS opacity
    await page.addStyleTag({ content: '.react-flow__handle { opacity: 1 !important; visibility: visible !important; }' });

    const nodes = page.locator('.react-flow__node');
    await expect(nodes).toHaveCount(3);

    const sourceNode = nodes.nth(1); // "Analysis Mode" node
    const targetNode = nodes.nth(2); // "Workflow Mode" node

    // Get handles
    const sourceHandle = sourceNode.locator('.react-flow__handle-right');
    const targetHandle = targetNode.locator('.react-flow__handle-left');

    // Get initial edge count
    const initialEdgeCount = await page.locator('.react-flow__edge').count();

    // Perform Drag and Drop
    await sourceHandle.hover();
    await page.mouse.down();
    await targetHandle.hover();
    await page.mouse.up();

    // Allow time for the connection to register
    await page.waitForTimeout(500);

    // Verify edge count increased
    const newEdgeCount = await page.locator('.react-flow__edge').count();
    expect(newEdgeCount).toBeGreaterThan(initialEdgeCount);
  });

  test('should delete edge via custom UI', async ({ page }) => {
    // Wait for edges to render
    await page.waitForSelector('.react-flow__edge');
    
    const initialEdgeCount = await page.locator('.react-flow__edge').count();
    
    // Hover over an edge to show the delete button (CustomEdge implementation)
    // We target the edge path wrapper or the edge group
    const firstEdge = page.locator('.react-flow__edge').first();
    
    // Move mouse to the center of the edge to trigger hover state
    const box = await firstEdge.boundingBox();
    if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    }

    // Look for the delete button within the edge label renderer
    // Note: The delete button usually appears in the EdgeLabelRenderer div
    const deleteBtn = page.locator('button[title="Delete Connection"]').first();
    
    // Force click if it's technically "hidden" by opacity until hover
    await deleteBtn.click({ force: true });

    // Verify edge count decreased
    await page.waitForTimeout(200);
    const newEdgeCount = await page.locator('.react-flow__edge').count();
    expect(newEdgeCount).toBe(initialEdgeCount - 1);
  });
});
