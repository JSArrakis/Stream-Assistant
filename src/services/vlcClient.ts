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
  // Start VLC using the command line
  execSync('start vlc');
  // Wait for VLC to complete its startup process
  // TODO - This is a race condition, and we need a better way to ensure VLC is fully started before returning
  await delay(2);
}

async function createVLCClient(password: string): Promise<VLC.Client> {
  // Created the VLC client using the password provided in the request
  // The VLC client requires a password to connect to the media player's web interface
  // Further Reading: https://wiki.videolan.org/Documentation:Modules/http_intf/#VLC_2.0.0_and_later
  const client = initializeVLCClient(password);
  // Get a list of all running processes
  const currentProcesses = listRunningProcesses();

  // Checks if VLC is running, if it is not it will start VLC
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
      .filter(line => line.trim() !== '') // Remove empty lines
      .map(line => line.trim()); // Trim whitespace

    return processesList;
  } catch (error: any) {
    console.error('Error:', error.message);
    return [];
  }
}

async function delay(seconds: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, seconds * 1000); // Convert seconds to milliseconds
  });
}

export { createVLCClient, isVLCRunning, listRunningProcesses };
