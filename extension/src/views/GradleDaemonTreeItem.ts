import * as vscode from 'vscode';
import * as path from 'path';
import { DaemonInfo } from '../proto/gradle_tasks_pb';
import { DAEMON_ICON_MAP } from './constants';

interface StatusEnumMapByValue {
  [key: number]: string;
}

const daemonStatusEnumMapByValue: StatusEnumMapByValue = Object.assign(
  {},
  ...Object.entries(DaemonInfo.DaemonStatus).map(([a, b]) => ({
    [b]: a,
  }))
);

export class GradleDaemonTreeItem extends vscode.TreeItem {
  constructor(
    private readonly context: vscode.ExtensionContext,
    public readonly label: string,
    private readonly daemonInfo: DaemonInfo
  ) {
    super(label, vscode.TreeItemCollapsibleState.None);
    const iconName = DAEMON_ICON_MAP[daemonInfo.getStatus()];
    this.iconPath = {
      light: this.context.asAbsolutePath(
        path.join('resources', 'light', iconName)
      ),
      dark: this.context.asAbsolutePath(
        path.join('resources', 'dark', iconName)
      ),
    };
  }

  get tooltip(): string {
    return `${this.label}-${this.status}}`;
  }

  get status(): string {
    return daemonStatusEnumMapByValue[this.daemonInfo.getStatus()];
  }

  get description(): string {
    return ' - ' + this.status;
  }

  get pidAsInt(): number {
    return parseInt(this.daemonInfo.getPid(), 10);
  }
}
