import Block from './Block';

class BlockGrid {
  constructor(width = 10, height = 10) {
    this.width = width;
    this.height = height;
    this.grid = [];

    for (let x = 0; x < this.width; x++) {
      const col = [];
      for (let y = 0; y < this.height; y++) {
        col.push(new Block(x, y));
      }

      this.grid.push(col);
    }
  }

  render(el = document.getElementById('gridEl')) {
    for (let x = 0; x < this.width; x++) {
      const id = 'col_' + x;
      const colEl = document.createElement('div');
      colEl.id = id;
      colEl.className = 'col';
      el.appendChild(colEl);

      for (let y = this.height - 1; y >= 0; y--) {
        const block = this.grid[x][y];
        const id = `block_${x}x${y}`;
        const blockEl = document.createElement('div');

        blockEl.id = id;
        if (block) {
          blockEl.className = 'block';
          blockEl.style.background = block.colour;
          blockEl.addEventListener('click', () => this.blockClicked(el, block));
        } else {
          blockEl.className = 'gap';
        }
        colEl.appendChild(blockEl);
      }
    }
  }

  clear(el = document.getElementById('gridEl')) {
    while (el.lastChild) {
      el.removeChild(el.lastChild);
    }
  }

  removeSameColor(block) {
    const toRemove = [block];

    while (toRemove.length > 0) {
      const { x, y, colour } = toRemove.shift();

      const up = y < this.height - 1 ? this.grid[x][y + 1] : null;
      const down = y > 0 ? this.grid[x][y - 1] : null;
      const left = x > 0 ? this.grid[x - 1][y] : null;
      const right = x < this.width - 1 ? this.grid[x + 1][y] : null;

      if (up && up.colour === colour) {
        toRemove.push(up);
      }
      if (down && down.colour === colour) {
        toRemove.push(down);
      }
      if (left && left.colour === colour) {
        toRemove.push(left);
      }
      if (right && right.colour === colour) {
        toRemove.push(right);
      }

      this.grid[x][y] = null;
    }
  }

  applyGravity() {
    for (let index = 0; index < this.width; index++) {
      const consolidated = this.grid[index].filter(b => b);
      this.grid[index] = consolidated.fill(
        null,
        consolidated.length,
        this.height
      );

      this.grid[index].forEach((block, newY) => {
        if (block) {
          block.y = newY;
        }
      });
    }
  }

  blockClicked(el, block) {
    this.removeSameColor(block);
    this.applyGravity();
    this.clear(el);
    this.render(el);
  }
}

export default BlockGrid;
