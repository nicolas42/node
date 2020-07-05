function draw_mandelbrot(canvas, m) {


    function hsl_to_rgb(h, s, l) {
        let r;
        let g;
        let b;
        function hue2rgb(p, q, t) {
            if (t < 0) {
                t += 1;
            }
            if (t > 1) {
                t -= 1;
            }
            if (t < 1 / 6) {
                return p + (q - p) * 6 * t;
            }
            if (t < 1 / 2) {
                return q;
            }
            if (t < 2 / 3) {
                return p + (q - p) * (2 / 3 - t) * 6;
            }
            return p;
        }

        let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        let p = 2 * l - q;

        if (s === 0) {
            r = 1;
            g = 1;
            b = 1; // achromatic
        } else {

            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }



    var img = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);

    // main loop
    for (var y = 0; y < img.height; y += 1) {
        for (var x = 0; x < img.width; x += 1) {

            // get math point from image point
            // image is flipped vertically. numbers go up, pixels go down. i don't care.
            let h = 4 / m.zoom;
            let w = 4 / m.zoom;

            // z = z^2 + c
            var cx = (m.x - w / 2) + x * (w / img.width);
            var cy = (m.y - h / 2) + y * (w / img.width);
            var zx = 0;
            var zy = 0;
            var in_set = true;
            var num_iterations = 1;
            for (; num_iterations <= m.max_iterations; num_iterations += 1) {
                var zxtemp = zx * zx - zy * zy + cx;
                zy = 2 * zx * zy + cy;
                zx = zxtemp;
                // if length of complex vector exceeds 4 then 
                // assume the pixel is not in the set
                if (zx * zx + zy * zy > 4) {
                    in_set = false;
                    break;
                }
            }

            // color in pixel
            let black = [0, 0, 0, 255];
            let stride = 4;
            var pos = (y * img.width * stride) + (x * stride);
            if (in_set) {
                img.data[pos + 0] = black[0];
                img.data[pos + 1] = black[1];
                img.data[pos + 2] = black[2];
                img.data[pos + 3] = black[3];
            } else {
                // hue is determined by the number of iterations taken
                var rgb = hsl_to_rgb((num_iterations % 255) / 255, 1, 0.5);
                img.data[pos + 0] = rgb[0];
                img.data[pos + 1] = rgb[1];
                img.data[pos + 2] = rgb[2];
                img.data[pos + 3] = black[3]; // no opacity
            }


        }
    }
    canvas.getContext("2d").putImageData(img, 0, 0);
}
