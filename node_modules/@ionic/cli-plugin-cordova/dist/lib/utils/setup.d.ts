import { IonicEnvironment } from '@ionic/cli-utils';
export declare function getProjectPlatforms(projectDir: string): Promise<string[]>;
export declare function getProjectPlugins(projectDir: string): Promise<string[]>;
export declare function installPlugins(env: IonicEnvironment): Promise<void>;
export declare function installPlatform(env: IonicEnvironment, platform: string): Promise<string>;
