import zlib
import struct
import math
import os

def make_png(width, height, is_maskable=False):
    # Generates a PNG with gradient background, glowing orb/flame, and border
    raw_data = bytearray()
    
    # Coordinates
    cx = width / 2.0
    cy = height / 2.0
    radius = width * (0.38 if is_maskable else 0.44)
    
    for y in range(height):
        # Filter type 0 (None)
        raw_data.append(0)
        ny = y / float(height)
        for x in range(width):
            nx = x / float(width)
            dx = x - cx
            dy = y - cy
            dist = math.sqrt(dx * dx + dy * dy)
            
            # Base dark purple-blue gradient
            r = int(9 + (30 - 9) * ny + (20 * nx))
            g = int(13 + (16 - 13) * ny)
            b = int(22 + (53 - 22) * ny + (30 * nx))
            a = 255
            
            # Glowing flame / orb in center
            if dist < radius:
                factor = 1.0 - (dist / radius)
                # Outer glow (purple/indigo)
                glow_r = int(168 * factor)
                glow_g = int(85 * factor)
                glow_b = int(247 * factor)
                
                # Inner core flame (warm amber/gold/red)
                inner_dist = math.sqrt(dx * dx + (dy + radius * 0.1) * (dy + radius * 0.1))
                if inner_dist < radius * 0.65:
                    inner_factor = 1.0 - (inner_dist / (radius * 0.65))
                    core_r = int(245 * inner_factor)
                    core_g = int(158 * inner_factor)
                    core_b = int(11 * inner_factor)
                    
                    r = min(255, r + glow_r + core_r)
                    g = min(255, g + glow_g + core_g)
                    b = min(255, b + glow_b + core_b)
                else:
                    r = min(255, r + glow_r)
                    g = min(255, g + glow_g)
                    b = min(255, b + glow_b)
            
            # Subtle cyan rim
            if abs(dist - radius * 0.85) < (width * 0.015):
                r = min(255, r + 34)
                g = min(255, g + 211)
                b = min(255, b + 238)

            raw_data.extend([r, g, b, a])
            
    # Pack into PNG structure
    def chunk(tag, data):
        length = struct.pack('>I', len(data))
        crc = struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)
        return length + tag + data + crc

    png_header = b'\x89PNG\r\n\x1a\n'
    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    idat = zlib.compress(bytes(raw_data), 9)
    
    return png_header + chunk(b'IHDR', ihdr) + chunk(b'IDAT', idat) + chunk(b'IEND', b'')

os.makedirs('public', exist_ok=True)

with open('public/pwa-192x192.png', 'wb') as f:
    f.write(make_png(192, 192, False))

with open('public/pwa-512x512.png', 'wb') as f:
    f.write(make_png(512, 512, False))

with open('public/pwa-maskable-512x512.png', 'wb') as f:
    f.write(make_png(512, 512, True))

with open('public/apple-touch-icon.png', 'wb') as f:
    f.write(make_png(180, 180, False))

print("Successfully generated all PWA icons in /public")
