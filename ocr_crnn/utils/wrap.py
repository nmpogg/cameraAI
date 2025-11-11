import numpy as np
import cv2

def order_points(pts):
    pts = np.array(pts)

    s = pts.sum(axis=1)
    TL = pts[np.argmin(s)]
    BR = pts[np.argmax(s)]

    diff = np.diff(pts, axis=1).reshape(-1)
    TR = pts[np.argmin(diff)]
    BL = pts[np.argmax(diff)]

    return np.array([TL, TR, BR, BL], dtype=np.float32)


def warp_plate(img, norm_points):
    h, w = img.shape[:2]

    pts = []
    for x, y in norm_points:
        px = x * w
        py = y * h
        pts.append([px, py])
    pts = np.float32(pts)

    pts_ordered = order_points(pts)
    (TL, TR, BR, BL) = pts_ordered

    widthA = np.linalg.norm(BR - BL)
    widthB = np.linalg.norm(TR - TL)
    maxWidth = int(max(widthA, widthB))

    heightA = np.linalg.norm(TR - BR)
    heightB = np.linalg.norm(TL - BL)
    maxHeight = int(max(heightA, heightB))

    dst = np.float32([
        [0, 0],
        [maxWidth - 1, 0],
        [maxWidth - 1, maxHeight - 1],
        [0, maxHeight - 1]
    ])

    M = cv2.getPerspectiveTransform(pts_ordered, dst)

    warped = cv2.warpPerspective(img, M, (maxWidth, maxHeight))

    return warped
