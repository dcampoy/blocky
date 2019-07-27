import BlockGrid from './BlockGrid';
import Block from './Block';

describe('BlockGrid', () => {
  it('fills a multidimensional array of Blocks as its grid, according to the given width and height', () => {
    const grid = new BlockGrid(10, 10).grid;

    expect(grid.length).toBe(10);

    grid.forEach(column => {
      expect(column.length).toBe(10);

      column.forEach(block => {
        expect(block).toBeInstanceOf(Block);
      });
    });

    const gridB = new BlockGrid(3, 5).grid;

    expect(gridB.length).toBe(3);

    gridB.forEach(column => {
      expect(column.length).toBe(5);
    });
  });

  it('renders the blocks in a div in the right order', () => {
    const blockGrid = new BlockGrid(3, 5);

    const gridEl = document.createElement('div');
    blockGrid.render(gridEl);

    const columnEls = Array.from(gridEl.children);
    columnEls.forEach((columnEl, x) => {
      expect(columnEl.id).toBe(`col_${x}`);
      expect(columnEl.className).toBe('col');

      const blockEls = Array.from(columnEl.children);
      blockEls.forEach((blockEl, i) => {
        const y = blockGrid.height - i - 1;
        expect(blockEl.id).toBe(`block_${x}x${y}`);
        expect(blockEl.className).toBe('block');
        expect(blockEl.style.background).toBe(blockGrid.grid[x][y].colour);
      });
    });
  });

  it('supports gaps in the grid', () => {
    const blockGrid = new BlockGrid(3, 5);
    blockGrid.grid[0][0] = null;

    const gridEl = document.createElement('div');
    blockGrid.render(gridEl);

    const blockEl = gridEl.querySelector('#block_0x0');
    expect(blockEl.className).toBe('gap');
    expect(blockEl.style.background).toBe('');
  });

  it('support to clear the board', () => {
    const blockGrid = new BlockGrid(3, 5);
    const gridEl = document.createElement('div');

    blockGrid.render(gridEl);
    expect(gridEl.children.length).toBeGreaterThan(0);

    blockGrid.clear(gridEl);
    expect(gridEl.children.length).toBe(0);
  });

  xit('good luck, have fun!', () => {});
});
