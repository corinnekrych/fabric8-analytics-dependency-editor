export class StackReportModel {
    finished_at: string;
    release: string;
    request_id: string;
    result: Array<ResultInformationModel>;
    started_at: string;
    version: string;
    dep_snapshot: Array<any>;
}

export class ResultInformationModel {
    manifest_name: string;
    manifest_file_path: string;
    recommendation: RecommendationsModel;
    user_stack_info: UserStackInfoModel;
}

export class AuditInformationModel {
    ended_at: string;
    started_at: string;
    version: string;
}

export class RecommendationsModel {
    alternate: Array<ComponentInformationModel>;
    companion: Array<ComponentInformationModel>;
    input_stack_topics: Array<any>;
    manifest_file_path: string;
    usage_outliers: Array<OutlierInformationModel>;
}

export class ComponentInformationModel {
    code_metrics: any; // Ignored from strict typing as this is of least importance
    ecosystem: string;
    github: GithubModel;
    latest_version: string;
    licenses: Array<string>;
    license_analysis: LicenseAnalysisModel;
    name: string;
    osio_user_count: number;
    replaces: any;
    reason: string;
    confidence_reason?: number;
    security: Array<SecurityInformationModel>;
    sentiment: SentimentModel;
    version: string;
    topic_list: Array<string>;
    alternate: ComponentInformationModel;
}

export class SecurityInformationModel {
    CVE: string;
    CVSS: string;
}

export class LicenseAnalysisModel {
    conflict_licenses: Array<any>;
    status: string;
    unknown_licenses: Array<any>;
    _message: string;
    _representative_licenses: any;
}

export class GithubModel {
    contributors: number;
    dependent_projects: number;
    dependent_repos: number;
    first_release_date: string;
    forks_count: number;
    issues: {
        month: {
            closed: number;
            opened: number;
        };
        year: {
            closed: number;
            opened: number;
        }
    };
    latest_release_duration: string;
    pull_requests: {
        month: {
            closed: number;
            opened: number;
        };
        year: {
            closed: number;
            opened: number;
        }
    };
    size: string;
    stargazers_count: number;
    total_releases: number;
    used_by: Array<any>;
    watchers: number;
}

export class SentimentModel {
    latest_comment: string;

    _representative_licenses: String;
}

export class LicenseResponseModel {
    _message: String;
    conflict_licenses: Array<ConflictPackageModel> = [];
    outlier_licenses: Array<ReallyUnknownLicenseModel> = [];
    status: String;
    synonyms: Array<any>; // SynonymLicenseModel;
    unknown_licenses: UnknownLicensesModel;
}

export class CategoryDataModel {
    packages: Array<CategoryResponseResultModel>;
    pkg_count: number;
}

export class CategoryResponseResultModel {
    category: string;
    name: string;
    version: string;
}

export class LicenseModel {
    license_analysis: LicenseResponseModel;
    licenses: Array<String>;
    package: String;
    version: String;
}

export class LicensePackageModel {
    compatible_packages: Array<String>;
    conflict_packages: Array<String>;
    unknown_license_packages: Array<String>;
}

export class LicenseFilterModel {
    alternate_packages: LicensePackageModel;
    companion_packages: LicensePackageModel;
}

export class LicenseStackAnalysisModel {
    conflict_packages: Array<ConflictPackageModel> = [];
    distinct_licenses: Array<string>;
    license_filter: LicenseFilterModel;
    outlier_packages: Array<ReallyUnknownLicenseModel> = [];
    packages: Array<LicenseModel>;
    stack_license: string;
    status: string;
    unknown_licenses: UnknownLicensesModel;
}

export class StackLicenseAnalysisModel {
    f8a_stack_licenses: Array<string> = [];
    current_stack_license: string;
    status: string;
    conflict_packages: Array<ConflictPackageModel> = [];
    unknown_licenses: UnknownLicensesModel;
    outlier_packages: Array<ReallyUnknownLicenseModel> = [];
    recommendation_ready: boolean;
    stack_license_conflict: boolean;
    total_licenses: number;
    unknown_dependencies: Array<any>;
    unknown_dependencies_count: number;
}

export class UserStackInfoModel {
    dependencies: Array<any>;
    analyzed_dependencies_count: number;
    analyzed_dependencies: Array<ComponentInformationModel>;
    distinct_licenses: Array<string>;
    ecosystem: string;
    license_analysis: StackLicenseAnalysisModel;
    recommendation_ready: boolean;
    recommended_stack_licenses: Array<string>;
    stack_license_conflict: boolean;
    total_licenses: number;
    unknown_dependencies: Array<any>;
    unknown_dependencies_count: number;
}

export class DependencySnapshotItem {
    package: string;
    version: string;
}

export class CveResponseModel {
    request_id: string;
    result: Array<CveResponseResultModel>;
    stack_highest_cvss: number;
    statusCode: 200;
    statusText: string;
}

export class CveResponseResultModel {
    ecosystem: string;
    package: string;
    version: string;
    cve: CveDataModel;
}

export class CveDataModel {
    highest_cvss: number;
    details: Array<CveDataDetailModel>;
}

export class CveDataDetailModel {
    cve_id: string;
    cvss: number;
}

export class DependencySearchItem {
    ecosystem: string;
    version: string;
    name: string;
}

export class CategorySearchItem {
    string: Array<CategoryDataModel>;
}

export class OutlierInformationModel {
    outlier_probabilty: number;
    package_name: string;
}

export class ConflictPackageModel {
    package1: string;
    license1: string;
    package2: string;
    license2: string;
}

export class ReallyUnknownLicenseModel {
    package: string;
    license: string;
}

export class ComponentConflictLicenseModel {
    license1: string;
    license2: string;
}

export class ComponentConflictUnknownModel {
    package: string;
    conflict_licenses: Array<ComponentConflictLicenseModel>;
}

export class UnknownLicensesModel {
    really_unknown: Array<ReallyUnknownLicenseModel> = [];
    component_conflict: Array<ComponentConflictUnknownModel> = [];
}

export class SynonymLicenseModel {
    license1: string;
    license2: string;
}

export class EventDataModel {
    depFull: ComponentInformationModel;
    depSnapshot: DependencySnapshotItem;
    action: string;
}

export class MissionInfo {
    id: string;
    name: string;
    icon: string;
    version: string;
}

export class BoosterInfo {
    mission: MissionInfo;
    runtime: MissionInfo;
}

export class AlertBox {
    header: {
        icon?: string;
        name: string;
        tooltip?: string;
        countInfo: string;
        secondaryInfo?: {
            mainText?: string;
            subText?: string;
        };
        indicator?: string;
    };
    body: {
        graphic?: {
            config: any;
        };
        normal?: [{
            isAccordion?: boolean;
            primaryText?: string;
            secondaryText?: string;
        }],
        defaultText?: string;
    };
}
export class LicenseUIModel {
    constructor(
        public licenseData: StackLicenseAnalysisModel = null,
        public lisData: LicenseStackAnalysisModel = null,
        public allLicenses: Array<string> = null
    ) {}
}

export class ErrorUIModel {
    constructor(
        public status: string,
        public message: string
    ) {}
}
