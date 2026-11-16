// Builds the small web page that shows one 360° photo.
// The page loads Pannellum (a free 360° viewer) from the internet,
// the same way an HTML page loads jQuery with a <script src="..."> tag.
const PANNELLUM = 'https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build';

// image is the photo as text: "data:image/jpeg;base64,..."
export function buildPanoramaHtml(image) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
  <link rel="stylesheet" href="${PANNELLUM}/pannellum.css">
  <style>
    html, body, #panorama { margin: 0; width: 100%; height: 100%; background: #000; }
    #message {
      display: none; position: absolute; top: 40%; left: 0; right: 0; padding: 0 24px;
      color: #fff; font-family: sans-serif; font-size: 16px; text-align: center;
    }
  </style>
</head>
<body>
  <div id="panorama"></div>
  <div id="message"></div>
  <script src="${PANNELLUM}/pannellum.js"></script>
  <script>
    var image = ${JSON.stringify(image)};

    function showMessage(text) {
      var box = document.getElementById('message');
      box.textContent = text;
      box.style.display = 'block';
    }

    // Turns the base64 text back into an image file in memory,
    // and returns a short address ("blob:...") the viewer can load it from.
    function makeImageUrl(dataUri) {
      var text = atob(dataUri.split(',')[1]);
      var bytes = new Uint8Array(text.length);
      for (var i = 0; i < text.length; i++) {
        bytes[i] = text.charCodeAt(i);
      }
      return URL.createObjectURL(new Blob([bytes], { type: 'image/jpeg' }));
    }

    if (!window.pannellum) {
      // The <script> tag above failed, usually because there is no internet
      showMessage('Could not load the 360° viewer. Check your internet connection.');
    } else {
      pannellum.viewer('panorama', {
        type: 'equirectangular', // the usual shape of a 360° photo: twice as wide as it is tall
        panorama: makeImageUrl(image),
        autoLoad: true,
        showControls: false,
        hfov: 100, // how wide the view is, in degrees
        autoRotate: -3, // turns slowly by itself until the user touches it
      });
    }
  </script>
</body>
</html>`;
}
