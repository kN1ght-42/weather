import fs from 'node:fs/promises'

export async function cacheFile(fileName: string, data: unknown) {
    await fs.mkdir('./reports', { recursive: true })
    await fs.writeFile(fileName, JSON.stringify(data, null, 2))
}

export async function fileExists(path: string): Promise<boolean> {
    try {
        await fs.access(path)
        return true
    } catch {
        return false
    }
}

export async function readFile(path: string): Promise<string> {
    return await fs.readFile(path, 'utf8')
}
