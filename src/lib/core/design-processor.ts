export class DesignProcessor {
  /**
   * Calculates proportional logo dimensions to prevent stretching.
   */
  static async calculateLogoDimensions(url: string, baseSize: number = 48): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        if (ratio > 1) {
          resolve({ width: baseSize, height: baseSize / ratio });
        } else {
          resolve({ width: baseSize * ratio, height: baseSize });
        }
      };
      img.onerror = () => resolve({ width: baseSize, height: baseSize });
      img.src = url;
    });
  }

  /**
   * Generates the CSS styles for the QR module border wrapper.
   */
  static getModuleStyles(design: { bgColor?: string; borderStyle?: string; fgColor?: string }) {
    return {
      backgroundColor: design.bgColor || '#FFFFFF',
      border: !design.borderStyle || design.borderStyle === 'none' ? 'none' : `8px ${design.borderStyle} ${design.fgColor || '#FF5722'}`,
      padding: '12px',
    };
  }
}
