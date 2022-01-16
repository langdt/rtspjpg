# rtspjpg

Create a static jpg image periodically from an rtsp stream.
Instead of trying to fetch the image on demand (which for my DVR is unreliable) it refreshes the image frequently and the URL provides the last fetched image.

```bash
CAM1_RTSP_URL="rtsp://user:pass@192.168.1.50:554/cam/realmonitor?channel=1&subtype=0" CAM2_RTSP_URL="rtsp://user:pass@192.168.1.50:554/cam/realmonitor?channel=2&subtype=0" node server.js
```

# Environment variables
## CAM1_RTSP_URL
Provide the URL to scrape for an image, when an image is captured it will be made available at http://localhost:3000/cam1.jpg

Any number of CAMx_RTSP_URL values can be set. It's also OK to set CAM1_RTSP_URL & CAM3_RTSP_URL, there's no need to have CAM1_RTSP_URL at all.

* CAM1_RTSP_URL maintains an image at http://localhost:3000/cam1.jpg
* CAM2_RTSP_URL maintains an image at http://localhost:3000/cam2.jpg

etc

## REFRESH_INTERVAL_MS
How often to refresh the images (specified in milliseconds). The default is every 5 seconds. Refreshing too often (with my DVR) leads to drop outs.
