export interface ImageType {
	imageNo: number;
	path: string;
	thumbnailPath: string;
}

export interface ImageTypeWithFile extends ImageType {
	imageFile: File;
	preview: any;
}
