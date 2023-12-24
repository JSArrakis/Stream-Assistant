// src/services/vlcClient.ts

import * as VLC from 'vlc-client';
import { execSync } from 'child_process';

function initializeVLCClient(password: string): VLC.Client {
    return new VLC.Client({
        ip: 'localhost',
        port: 8080,
        username: '',
        password: password,
    });
}

function isVLCRunning(processesList: string[]): boolean {
    for (const processInfo of processesList) {
        if (processInfo.toLowerCase().includes('vlc.exe')) {
            return true;
        }
    }
    return false;
}

async function startVLC(): Promise<void> {
    execSync('start vlc');
    await delay(2);
}

async function createVLCClient(password: string): Promise<VLC.Client> {
    const client = initializeVLCClient(password);
    const currentProcesses = listRunningProcesses();

    if (!isVLCRunning(currentProcesses)) {
        await startVLC();
    }

    return client;
}

function listRunningProcesses(): string[] {
    try {
        const stdout = execSync('tasklist', { encoding: 'utf-8' });
        const processesList = stdout
            .split('\n')
            .filter((line) => line.trim() !== '') // Remove empty lines
            .map((line) => line.trim()); // Trim whitespace

        return processesList;
    } catch (error: any) {
        console.error('Error:', error.message);
        return [];
    }
}

async function delay(seconds: number): Promise<void> {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, seconds * 1000); // Convert seconds to milliseconds
    });
}

export {
    createVLCClient,
    isVLCRunning,
    listRunningProcesses,
};
