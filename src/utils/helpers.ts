import { Modifier } from "@dnd-kit/core";

export const restrictToGridArea = ({
    gridWidth,
    gridHeight,
    cellSize,
    margin,
  }: {
    gridWidth: number; // Max grid width in pixels
    gridHeight: number; // Max grid height in pixels
    cellSize: number; // Cell size in pixels
    margin: number; // Margin around grid
  }): Modifier => {
    return ({ transform, activeNodeRect, containerNodeRect }) => {
      if (!activeNodeRect || !containerNodeRect) return transform;
  
      const minX = margin;
      const minY = margin;
      const maxX = gridWidth - activeNodeRect.width - margin;
      const maxY = gridHeight - activeNodeRect.height - margin;
  
      const newX = Math.max(minX, Math.min(maxX, transform.x));
      const newY = Math.max(minY, Math.min(maxY, transform.y));
  
      return {
        ...transform,
        x: newX,
        y: newY,
      };
    };
  };


  export const throttleDrag = (frequency: number): Modifier => {
    let lastUpdate = 0;
  
    return ({ transform, ...args }) => {
      const now = Date.now();
      if (now - lastUpdate >= frequency) {
        lastUpdate = now;
      }
      return transform; // Always return the transform to allow dragging
    };
  };