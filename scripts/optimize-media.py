#!/usr/bin/env python3
"""Regenerate committed media variants. Requires ffmpeg and ffprobe on PATH."""
import json
from pathlib import Path
import subprocess

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / 'images' / 'optimized'


def probe(source):
    return json.loads(subprocess.check_output([
        'ffprobe', '-v', 'error', '-select_streams', 'v:0',
        '-show_entries', 'stream=width,height', '-of', 'json', str(source)
    ]))['streams'][0]


def convert(source, args, destination):
    subprocess.run([
        'ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source),
        *args, str(OUTPUT / destination)
    ], check=True)


def image_variants(name, requested_widths, quality=82):
    source = next(p for p in (ROOT / 'images').glob(name + '.*')
                  if p.suffix in {'.png', '.jpg'})
    widths = sorted({min(w, probe(source)['width']) for w in requested_widths})
    for width in widths:
        convert(source, ['-vf', f'scale={width}:-2', '-frames:v', '1',
                         '-quality', str(quality)], f'{name}-{width}.webp')


def main():
    OUTPUT.mkdir(exist_ok=True)
    image_variants('wide', [800, 1600, 1920], 80)
    for name in ['viuwb', '3dvr', 'vrsmell', 'pixstab', 'TaiChi', 'complementary', 'face']:
        image_variants(name, [320, 640])
    for name in ['ArtNVpipeline', 'artnv_vr']:
        image_variants(name, [640, 1280, 1920], 85)
    for name in ['viobjtrack', 'artnv', 'Deep3D', 'GCVD']:
        source = ROOT / 'images' / f'{name}.gif'
        convert(source, ['-vf', 'scale=min(640\\,iw):-2', '-an', '-c:v', 'libx264',
                         '-crf', '24', '-pix_fmt', 'yuv420p', '-movflags', '+faststart'],
                f'{name}.mp4')
        # Deep3D starts on black; choose a representative frame instead.
        poster_args = ['-ss', '2'] if name == 'Deep3D' else []
        convert(source, [*poster_args, '-frames:v', '1', '-vf', 'scale=min(640\\,iw):-2',
                         '-quality', '80'], f'{name}-poster.webp')
    print(f'Regenerated assets in {OUTPUT}. Original files are unchanged.')


if __name__ == '__main__':
    main()
