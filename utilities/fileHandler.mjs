import fs from 'fs';
import path from 'path';
import { writeFile, readFile } from 'fs/promises';

export const writeFileAsync = async (folderName, fileName, data) => {
    try {
        const filePath = path.join(__appdir, folderName, fileName);
        await writeFile(filePath, data);
    } catch (error) {
        throw new Error(`Error writing file: ${error.message}`);
    }
};

export const readFileAsync = async (folderName, fileName) => {
    try {
        const filePath = path.join(__appdir, folderName, fileName);
        const data = await readFile(filePath, 'utf-8');
        return data;
    } catch (error) {
        throw new ErrorResponse(`Failed to read file: ${error.message}`, 500)
    }
}

