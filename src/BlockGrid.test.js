import BlockGrid from './BlockGrid';
import Block, { COLOURS } from './Block';

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

  it('clicking in a block remove it along with all connected neighbours with the same color', () => {
    //     0 1 2 3 4         0 1 2 3 4
    //     - - - - -         - - - - -
    // 3 | R R R G R     3 |       G R
    // 2 | R R R G G  →  2 |       G G
    // 1 | R R R G G     1 |       G G
    // 0 | G G G G G     0 | G G G G G

    const blockGrid = new BlockGrid(5, 4);
    const gridEl = document.createElement('div');

    blockGrid.grid.forEach(column => {
      column.forEach(block => {
        const { x, y } = block;
        if (x < 3 && y > 0) {
          block.colour = COLOURS[0];
        } else if (x == 4 && y == 3) {
          block.colour = COLOURS[0];
        } else block.colour = COLOURS[1];
      });
    });

    blockGrid.render(gridEl);
    gridEl.querySelector('#block_1x2').click();

    const clicked = gridEl.querySelector('#block_1x2');
    const up = gridEl.querySelector('#block_1x3');
    const upLeft = gridEl.querySelector('#block_0x3');
    const anotherColor = gridEl.querySelector('#block_0x0');
    const unconnected = gridEl.querySelector('#block_4x3');

    expect(clicked.className).toBe('gap');
    expect(up.className).toBe('gap');
    expect(upLeft.className).toBe('gap');
    expect(anotherColor.className).toBe('block');
    expect(unconnected.className).toBe('block');
  });

  it('has gravity!', () => {
    // | G |    | G |   |   |
    // | B | →  | B | → |   |
    // | R |    |   |   | G |
    // | R |    |   |   | B |
    const blockGrid = new BlockGrid(1, 4);
    const gridEl = document.createElement('div');

    blockGrid.grid[0][3].colour = COLOURS[1];
    blockGrid.grid[0][2].colour = COLOURS[2];
    blockGrid.grid[0][1].colour = COLOURS[0];
    blockGrid.grid[0][0].colour = COLOURS[0];

    blockGrid.render(gridEl);
    gridEl.querySelector('#block_0x0').click();

    const expectedGap = gridEl.querySelector('#block_0x2');
    const expectedGreen = gridEl.querySelector('#block_0x1');
    const expectedBlue = gridEl.querySelector('#block_0x0');

    expect(expectedGap.className).toBe('gap');
    expect(expectedGreen.style.background).toBe(COLOURS[1]);
    expect(expectedBlue.style.background).toBe(COLOURS[2]);
  });
});
