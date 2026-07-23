from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
TEAM = ROOT / "assets" / "team"


def save_cover(source: Path, destination: Path, size: tuple[int, int], quality: int = 82) -> None:
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        image = ImageOps.fit(image, size, method=Image.Resampling.LANCZOS, centering=(0.5, 0.28))
        image.save(destination, "WEBP", quality=quality, method=6)


def save_contained(source: Path, destination: Path, max_size: tuple[int, int], quality: int = 82) -> None:
    with Image.open(source) as image:
        image = ImageOps.exif_transpose(image).convert("RGB")
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        image.save(destination, "WEBP", quality=quality, method=6)


for source in TEAM.iterdir():
    if source.suffix.lower() not in {".png", ".jpg", ".jpeg"}:
        continue
    output = source.with_suffix(".webp")
    target_size = (1200, 1500) if source.stem == "fiona-denton" else (720, 820)
    save_cover(source, output, target_size)

save_contained(ROOT / "assets" / "sunny-mountain.png", ROOT / "assets" / "sunny-mountain.webp", (1800, 1200), 80)
save_contained(
    ROOT / "assets" / "hero-consulting-room.png",
    ROOT / "assets" / "hero-consulting-room.webp",
    (2200, 1400),
    82,
)
