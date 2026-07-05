export function buildImageUrl(path?: string | null) {
    if (!path) return null;
    if (typeof window === "undefined") return path;

    const trimmedPath = path.trim();
    if (!trimmedPath) return null;

    if (trimmedPath.startsWith("http://") || trimmedPath.startsWith("https://")) {
        return trimmedPath;
    }

    if (trimmedPath.startsWith("/")) {
        return `${window.location.origin}${trimmedPath}`;
    }

    return `${window.location.origin}/${trimmedPath}`;
}
