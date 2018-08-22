import { DependencySnapshotItem, ComponentInformationModel } from '../model/data.model';

export class DependencySnapshot {
    public static DEP_SNAPSHOT: Array<DependencySnapshotItem> = [];
    public static DEP_SNAPSHOT_ADDED: Array<DependencySnapshotItem> = [];
    public static DEP_FULL_ADDED: Array<ComponentInformationModel> = [];
    public static ECOSYSTEM = '';
    public static REQUEST_ID = '';
}
