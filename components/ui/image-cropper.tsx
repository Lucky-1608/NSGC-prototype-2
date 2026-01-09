'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { GlassModal } from '@/components/ui/glass-modal';
import { Check, X, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageCropperProps {
    image: string;
    aspectRatio?: number;
    onCropComplete: (croppedImage: string) => void;
    onCancel: () => void;
}

export function ImageCropper({ image, aspectRatio = 1, onCropComplete, onCancel }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

    const onCropChange = useCallback((crop: { x: number; y: number }) => {
        setCrop(crop);
    }, []);

    const onZoomChange = useCallback((zoom: number) => {
        setZoom(zoom);
    }, []);

    const onCropCompleteCallback = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const createCroppedImage = async () => {
        try {
            const croppedImage = await getCroppedImg(image, croppedAreaPixels);
            if (croppedImage) {
                onCropComplete(croppedImage);
            }
        } catch (e) {
            console.error('Error cropping image', e);
        }
    };

    return (
        <GlassModal
            isOpen={true}
            onClose={onCancel}
            title="Adjust Photo"
            footer={
                <div className="flex justify-between w-full gap-4">
                    <Button variant="outline" onClick={onCancel} className="flex-1 border-white/20 hover:bg-white/10 text-white">
                        <X className="w-4 h-4 mr-2" /> Cancel
                    </Button>
                    <Button onClick={createCroppedImage} className="flex-1 bg-yellow-500 text-black hover:bg-yellow-400 font-bold">
                        <Check className="w-4 h-4 mr-2" /> Apply Crop
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                <div className="relative h-[400px] w-full bg-black rounded-lg overflow-hidden border border-white/10">
                    <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio}
                        onCropChange={onCropChange}
                        onCropComplete={onCropCompleteCallback}
                        onZoomChange={onZoomChange}
                    />
                </div>

                <div className="space-y-2 px-4">
                    <div className="flex items-center justify-between text-sm text-gray-400">
                        <span className="flex items-center gap-2"><ZoomOut className="w-4 h-4" /> Zoom</span>
                        <span className="flex items-center gap-2"><ZoomIn className="w-4 h-4" /></span>
                    </div>
                    {/* Simplified Slider for now if component is missing, checking later */}
                    <div className="flex items-center gap-4">
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                        />
                    </div>
                </div>
            </div>
        </GlassModal>
    );
}

// Helper to create the cropped image
async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<string | null> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        return null;
    }

    // set canvas size to match the bounding box
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // draw the image
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    // As Base64 string
    return canvas.toDataURL('image/jpeg');
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues on CodeSandbox
        image.src = url;
    });
}
