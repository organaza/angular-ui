export class FileUtils {
  static imageExtensions: string[] = [
    'png',
    'jpeg',
    'jpg',
    'gif',
    'svg',
    'tiff',
    'bmp',
  ];
  static testImageExtension(filename: string): boolean {
    const extension = filename.split('.').pop().toLowerCase();
    return this.imageExtensions.indexOf(extension) > -1;
  }
}
