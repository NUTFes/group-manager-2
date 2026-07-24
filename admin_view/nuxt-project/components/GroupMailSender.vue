<template>
  <div class="group-mail-sender">
    <Card
      width="100%"
      height="100%"
      style="align-items: flex-start; min-height: 0"
    >
      <div class="comment-header">
        <h3>メッセージ</h3>
      </div>
      <div class="comment-form">
        <div class="message-mode-panel">
          <label class="message-mode-label" for="message-mode-select">
            種別
          </label>
          <select
            id="message-mode-select"
            class="message-mode-select"
            v-model="sendMode"
          >
            <option value="mail">メール</option>
            <option value="memo">メモ</option>
          </select>
        </div>
        <div class="message-template-panel">
          <label class="message-template-label" for="message-template-select">
            テンプレート
          </label>
          <select
            id="message-template-select"
            class="message-template-select"
            :value="selectedMessageTemplateId"
            @change="onTemplateSelect($event.target.value)"
          >
            <option value="">テンプレートを選択</option>
            <option
              v-for="template in messageTemplates"
              :key="template.id"
              :value="String(template.id)"
            >
              {{ template.name }}（{{ template.locale }}）
            </option>
          </select>
          <p v-if="messageSendResult" class="message-send-result" role="status">
            {{ messageSendResult }}
          </p>
        </div>
        <label class="comment-subject-label" for="comment-subject-input">件名</label>
        <input
          id="comment-subject-input"
          type="text"
          class="comment-subject-input"
          placeholder="件名"
          v-model="commentSubject"
          :disabled="isSendingMessage"
        />
        <label class="comment-body-label" for="comment-body-textarea">本文</label>
        <textarea
          id="comment-body-textarea"
          class="comment-textarea"
          :placeholder="
            sendMode === 'mail' ? 'メールで送信するコメント' : '実行委員内で共有するメモ'
          "
          v-model="commentBody"
          :disabled="isSendingMessage"
        ></textarea>
        <CommonButton
          :iconName="sendMode === 'mail' ? 'send' : 'save'"
          :on_click="openMessagePreview"
          :disabled="isSendingMessage || !canSendMessage"
        >
          {{ sendMode === "mail" ? "送信" : "保存" }}
        </CommonButton>
      </div>

      <div class="comment-history">
        <h4>送信履歴</h4>
        <details
          v-for="comment in comments"
          :key="comment.id"
          class="comment-accordion"
        >
          <summary>
            <span class="comment-summary-time">
              <span class="comment-timestamp">{{ formatCommentTimestamp(comment.created_at) }}</span>
              <span class="comment-summary-subject">{{ comment.subject }}</span>
            </span>
            <span
              class="mail-delivery-status"
              :class="mailDeliveryStatusClass(comment.mail_delivery_status)"
            >
              {{ mailDeliveryStatusLabel(comment.mail_delivery_status) }}
            </span>
            <span
              v-if="comment.source === 'order_status'"
              class="source-label source-label--order-status"
            >
              【申請状況】
            </span>
            <span
              v-else-if="comment.source === 'health_center'"
              class="source-label source-label--health-center"
            >
              【保健所確認】
            </span>
          </summary>
          <p class="comment-body">{{ comment.body }}</p>
          <CommonButton
            v-if="comment.mail_delivery_status === 'failed'"
            iconName="send"
            :on_click="() => resendCommentMail(comment)"
            :disabled="isSendingMessage || resendingCommentId === comment.id"
          >
            {{ resendingCommentId === comment.id ? "再送信中" : "再送信" }}
          </CommonButton>
        </details>
        <p v-if="comments.length === 0">送信履歴はまだありません</p>
      </div>
    </Card>

    <EditModal
      v-if="isPreviewModalOpen"
      :title="sendMode === 'mail' ? '送信内容の確認' : 'メモ保存の確認'"
      @close="closeMessagePreview"
    >
      <template v-slot:form>
        <div v-if="sendMode === 'mail'" class="mail-preview-field">
          <h3>宛先</h3>
          <p>{{ userEmail }}</p>
        </div>
        <div class="mail-preview-field">
          <h3>件名</h3>
          <p>{{ renderedMessageSubject }}</p>
        </div>
        <div class="mail-preview-field">
          <h3>本文</h3>
          <pre>{{ renderedMessageBody }}</pre>
        </div>
      </template>
      <template v-slot:method>
        <div class="mail-preview-actions">
          <CommonButton
            iconName="close"
            :on_click="closeMessagePreview"
            :disabled="isSendingMessage"
          >
            キャンセル
          </CommonButton>
          <CommonButton
            :iconName="sendMode === 'mail' ? 'send' : 'save'"
            :on_click="confirmMessageSend"
            :disabled="isSendingMessage"
          >
            {{
              isSendingMessage
                ? sendMode === "mail"
                  ? "送信中"
                  : "保存中"
                : sendMode === "mail"
                ? "送信する"
                : "保存する"
            }}
          </CommonButton>
        </div>
      </template>
    </EditModal>

    <EditModal
      v-if="isOverwriteModalOpen"
      title="テンプレートの反映確認"
      @close="cancelTemplateOverwrite"
    >
      <template v-slot:form>
        <p class="overwrite-confirm-text">
          入力中の件名・本文をテンプレートの内容で上書きします。よろしいですか？
        </p>
      </template>
      <template v-slot:method>
        <div class="mail-preview-actions">
          <CommonButton iconName="close" :on_click="cancelTemplateOverwrite">
            取消
          </CommonButton>
          <CommonButton iconName="check" :on_click="confirmTemplateOverwrite">
            上書き
          </CommonButton>
        </div>
      </template>
    </EditModal>
  </div>
</template>

<script>
export default {
  props: {
    groupId: {
      type: Number,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    sourcePage: {
      type: String,
      required: true,
    },
    groupName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      sendMode: "mail",
      messageTemplates: [],
      selectedMessageTemplateId: "",
      commentSubject: "",
      commentBody: "",
      isSendingMessage: false,
      messageSendResult: "",
      resendingCommentId: null,
      comments: [],
      isPreviewModalOpen: false,
      isOverwriteModalOpen: false,
      pendingTemplateId: "",
    };
  },
  computed: {
    canSendMessage() {
      return (
        this.userEmail &&
        this.commentSubject.trim().length > 0 &&
        this.commentBody.trim().length > 0
      );
    },
    renderedMessageSubject() {
      return this.commentSubject.trim();
    },
    renderedMessageBody() {
      return this.commentBody.trim();
    },
    messageTemplateValues() {
      return {
        group_name: this.groupName || "",
        user_name: this.userName || "",
      };
    },
  },
  async mounted() {
    await this.fetchMessageTemplates();
    await this.fetchComments();
  },
  methods: {
    async fetchMessageTemplates() {
      try {
        const response = await this.$axios.get("/api/v1/message_templates");
        this.messageTemplates = response.data.data || response.data || [];
      } catch (error) {
        console.error("メッセージテンプレートの取得に失敗しました:", error);
      }
    },
    async fetchComments() {
      try {
        const response = await this.$axios.get(`/api/v1/group_mail_comments`, {
          params: { group_id: this.groupId },
        });
        this.comments = response.data.data || response.data || [];
      } catch (error) {
        console.error("送信履歴の取得に失敗しました:", error);
      }
    },
    renderTemplateText(text, values) {
      return String(text || "").replace(
        /\{(group_name|user_name)\}/g,
        (_, key) => String(values[key] || "")
      );
    },
    onTemplateSelect(newTemplateId) {
      const hasContent =
        this.commentSubject.trim().length > 0 ||
        this.commentBody.trim().length > 0;

      if (hasContent) {
        this.pendingTemplateId = newTemplateId;
        this.isOverwriteModalOpen = true;
        return;
      }

      this.applyTemplateSelection(newTemplateId);
    },
    applyTemplateSelection(templateId) {
      this.selectedMessageTemplateId = templateId;
      const template = this.messageTemplates.find(
        (t) => String(t.id) === templateId
      );

      if (!template) {
        this.commentSubject = "";
        this.commentBody = "";
        return;
      }

      this.commentSubject = this.renderTemplateText(
        template.subject,
        this.messageTemplateValues
      );
      this.commentBody = this.renderTemplateText(
        template.body,
        this.messageTemplateValues
      );
      this.messageSendResult = "";
    },
    confirmTemplateOverwrite() {
      this.applyTemplateSelection(this.pendingTemplateId);
      this.pendingTemplateId = "";
      this.isOverwriteModalOpen = false;
    },
    cancelTemplateOverwrite() {
      this.pendingTemplateId = "";
      this.isOverwriteModalOpen = false;
    },
    openMessagePreview() {
      if (!this.canSendMessage) return;
      this.isPreviewModalOpen = true;
    },
    closeMessagePreview() {
      this.isPreviewModalOpen = false;
    },
    async confirmMessageSend() {
      this.isSendingMessage = true;
      this.messageSendResult = "";
      try {
        const payload = {
          group_id: this.groupId,
          message_template_id: this.selectedMessageTemplateId || null,
          subject: this.commentSubject.trim(),
          body: this.commentBody,
        };

        if (this.sourcePage === "health_center") {
          // TODO: 将来的にはapplication_typeを動的に選択できるようにする（現在は food_product に固定）
          payload.application_type = "food_product";
          const endpoint =
            this.sendMode === "memo"
              ? "/api/v1/create_health_center_submission_status_comment"
              : "/api/v1/create_health_center_submission_status_comment_mail";
          await this.$axios.post(endpoint, payload);
        } else {
          const endpoint =
            this.sendMode === "memo"
              ? "/api/v1/create_order_status_check_comment"
              : "/api/v1/order_status_check_comment_mails";
          await this.$axios.post(endpoint, payload);
        }

        this.commentSubject = "";
        this.commentBody = "";
        this.selectedMessageTemplateId = "";
        this.messageSendResult =
          this.sendMode === "memo" ? "保存しました" : "送信しました";
        this.closeMessagePreview();
        await this.fetchComments();
      } catch (error) {
        console.error("メッセージの送信に失敗しました:", error);
        this.messageSendResult =
          this.sendMode === "memo" ? "保存に失敗しました" : "送信に失敗しました";
        this.closeMessagePreview();
        await this.fetchComments(); // エラー履歴も表示するため
      } finally {
        this.isSendingMessage = false;
        setTimeout(() => {
          this.messageSendResult = "";
        }, 3000);
      }
    },
    async resendCommentMail(comment) {
      this.resendingCommentId = comment.id;
      this.messageSendResult = "";
      try {
        if (comment.source === "health_center") {
          await this.$axios.post(
            `/api/v1/resend_health_center_submission_status_comment_mail/${comment.id}`
          );
        } else {
          await this.$axios.post(
            `/api/v1/order_status_check_comment_mails/${comment.id}/resend`
          );
        }
        this.messageSendResult = "再送信しました";
        await this.fetchComments();
      } catch (error) {
        console.error("再送信に失敗しました:", error);
        this.messageSendResult = "再送信に失敗しました";
        await this.fetchComments(); // ステータス更新反映のため
      } finally {
        this.resendingCommentId = null;
        setTimeout(() => {
          this.messageSendResult = "";
        }, 3000);
      }
    },
    formatCommentTimestamp(timestamp) {
      if (!timestamp) return "";
      const date = new Date(timestamp);
      return date.toLocaleString("ja-JP", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    },
    mailDeliveryStatusLabel(status) {
      if (status === "sent") return "送信済";
      if (status === "memo") return "メモ";
      return "エラー";
    },
    mailDeliveryStatusClass(status) {
      if (status === "sent") return "mail-delivery-status--sent";
      if (status === "memo") return "mail-delivery-status--memo";
      return "mail-delivery-status--failed";
    },
  },
};
</script>

<style scoped>
.group-mail-sender {
  width: 100%;
}

.comment-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.comment-form {
  width: 100%;
  padding: 0;
  margin: 0;
}

.comment-history {
  width: 100%;
  margin-top: 16px;
}

.message-mode-panel {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

.message-mode-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent-8);
}

.message-mode-select {
  width: 100%;
  min-height: 40px;
  padding: 8px 10px;
  border: 1px solid var(--accent-2);
  border-radius: 4px;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 14px;
}

.message-mode-select:focus {
  outline: none;
  border-color: var(--button-primary);
}

.message-template-panel {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin-bottom: 12px;
}

.message-template-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--accent-8);
}

.message-template-select {
  width: 100%;
  min-height: 40px;
  padding: 8px 10px;
  border: 1px solid var(--accent-2);
  border-radius: 4px;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 14px;
}

.message-template-select:focus {
  outline: none;
  border-color: var(--button-primary);
}

.message-send-result {
  margin: 0;
  font-size: 13px;
  color: var(--accent-8);
}

.comment-accordion {
  width: 100%;
  border: 1px solid var(--accent-2);
  border-radius: 6px;
  padding: 8px 10px;
  margin-top: 8px;
  background: #fff;
}

.comment-accordion summary {
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

.comment-summary-time {
  display: flex;
  flex-direction: column;
  line-height: 1.4;
}

.comment-summary-subject {
  font-size: 0.85em;
  font-weight: normal;
  color: var(--accent-8);
}

.comment-body {
  white-space: pre-wrap;
  margin: 10px 0 4px;
}

.comment-subject-label,
.comment-body-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent-8);
  margin-bottom: 4px;
}

.comment-subject-input {
  width: 100%;
  min-height: 40px;
  padding: 8px 10px;
  border: 1px solid var(--accent-2);
  border-radius: 4px;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 14px;
  margin-bottom: 12px;
}

.comment-subject-input:focus {
  outline: none;
  border-color: var(--button-primary);
}

.comment-subject-input:disabled {
  background-color: var(--accent-1);
}

.comment-textarea {
  width: 100%;
  height: 300px;
  padding: 12px;
  border: 1px solid var(--accent-2);
  border-radius: 4px;
  font-family: inherit;
  font-size: 14px;
  resize: vertical;
  box-sizing: border-box;
  margin-bottom: 12px;
}

.comment-textarea:focus {
  outline: none;
  border-color: var(--button-primary);
}

.comment-textarea:disabled {
  background-color: var(--accent-1);
}

.mail-delivery-status {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  margin-left: 8px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0;
}

.mail-delivery-status--sent {
  background: #e7f5ec;
  color: #1f7a3f;
}

.mail-delivery-status--failed {
  background: #fff3dc;
  color: #9a5b00;
}

.mail-delivery-status--memo {
  background: #e8eaf6;
  color: #3949ab;
}

.source-label {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.85em;
  font-weight: bold;
}
.source-label--order-status {
  background-color: #e3f2fd;
  color: #1565c0;
}
.source-label--health-center {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.mail-preview-field {
  width: 100%;
}

.mail-preview-field p,
.mail-preview-field pre {
  width: 500px;
  overflow-y: auto;
  margin: 0;
  padding: 12px;
  border: 1px solid var(--accent-2);
  border-radius: 4px;
  background: #fafafa;
  color: #222;
  font-family: inherit;
  font-size: 14px;
  line-height: 1.65;
  white-space: pre-wrap;
  word-break: break-word;
}

.mail-preview-field p {
  min-height: 20px;
}

.mail-preview-field pre {
  min-height: 220px;
  max-height: 380px;
}

.mail-preview-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.overwrite-confirm-text {
  width: 500px;
  margin: 0;
  color: #222;
  font-size: 14px;
  line-height: 1.65;
}
</style>
