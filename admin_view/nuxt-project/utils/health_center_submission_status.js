// hasApplication: 申請物（food_product, venue_map 等）自体は存在するが
// ステータスレコードが無い場合は「未確認(unapproved)」を返す。
// 申請物自体が存在しない場合のみ「未提出(unsubmitted)」として扱う。
export const normalizeSubmissionStatus = (value, hasApplication = false) => {
  if (
    value === false ||
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return hasApplication ? "unapproved" : "unsubmitted";
  }
  return value;
};

// 詳細APIはステータスレコード未作成時にも既定のstatusを返すため、
// idの有無で永続化済みのステータスかどうかを判定する。
export const normalizeSubmissionRecordStatus = (
  submission,
  hasApplication = false
) => {
  const hasStatusRecord =
    submission?.id !== null && submission?.id !== undefined;
  const status = hasStatusRecord ? submission.status : undefined;
  return normalizeSubmissionStatus(status, hasApplication);
};

const STATUS_META = {
  unapproved: {
    icon: "notification_important",
    label: "未確認",
  },
  waiting_resubmission: {
    icon: "autorenew",
    label: "再提出待ち",
  },
  approved: {
    icon: "check",
    label: "承認済み",
  },
  unsubmitted: {
    icon: "close",
    label: "未提出",
  },
};

export const getSubmissionStatusMeta = (status) => {
  return STATUS_META[status] || STATUS_META.unapproved;
};

const STATUS_SELECT_CLASS = {
  unapproved: "status-select--unapproved",
  waiting_resubmission: "status-select--waiting-resubmission",
  approved: "status-select--approved",
  unsubmitted: "status-select--unsubmitted",
};

export const getSubmissionStatusSelectClass = (value) => {
  return STATUS_SELECT_CLASS[value] || STATUS_SELECT_CLASS.unapproved;
};
