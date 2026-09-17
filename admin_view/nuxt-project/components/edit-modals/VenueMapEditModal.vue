<template>
  <EditModal @close="$emit('close')" title="模擬店平面図の編集">
    <template v-slot:form>
      <div>
        <h3>団体名</h3>
        <input v-model="groupName" placeholder="入力してください" readonly />
      </div>
      <div>
        <h3>模擬店平面図</h3>
        <label>
          <input type="file" accept=".png, .jpg, .jpeg" @change="fileUpload" />
          <div v-if="isInvalidFile === true" style="color: red">
            ファイル形式は[.pngか.jpeg又は.jpg]にしてください
          </div>
          <div v-else-if="isFileCheck === true" style="color: red">
            ファイル名には、日本語・英数字・ハイフン（-）・アンダースコア（_）・スペース「」が使用できます。
          </div>
          <div v-else-if="isFileSizeCheck === true" style="color: red">
            ファイルサイズは20MB以下にしてください
          </div>
        </label>
      </div>
    </template>
    <template v-slot:method>
      <CommonButton
        iconName="edit"
        :disabled="isPush.disabled || (!isFile && !getVenueMap().id)"
        :on_click="edit"
        >{{ buttonState }}</CommonButton
      >
    </template>
  </EditModal>
</template>

<script>
import { uploadImageToImgur } from "~/utils/imgur_upload";

export default {
  props: {
    venueMap: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      buttonState: "登録",
      isPush: { disabled: false },
      isInvalidFile: false,
      isFile: false,
      isFileCheck: false,
      isFileSizeCheck: false,
      groupName: "",
      files: null,
      progress: 0,
      state: null,
    };
  },
  watch: {
    venueMap: {
      immediate: true,
      handler() {
        this.groupName =
          this.venueMap?.group?.name ||
          this.venueMap?.venue_map?.group_name ||
          this.venueMap?.group_name ||
          this.venueMap?.groupName ||
          "";
      },
    },
  },
  methods: {
    getVenueMap() {
      return this.venueMap?.venue_map || this.venueMap || {};
    },
    fileUpload(event) {
      this.files = event.target.files;
      if (this.files.length > 0) {
        const file = this.files[0];

        const validFileName = ["png", "jpeg", "jpg"];
        const fileName = file.name.split(".").pop().toLowerCase();
        this.isInvalidFile = !validFileName.includes(fileName);
        const fileNameRegex = /^[^\\/:*?"<>|\r\n]+$/;
        const fILE_SIZE_LIMIT = 20 * 1024 * 1024; // 20MB
        this.isFileSizeCheck = file.size > fILE_SIZE_LIMIT;

        // ファイルサイズのバリデーション
        if(this.isFileSizeCheck){
          this.isFileSizeCheck = true;
          this.isFile = false;
          // ファイル形式のバリデーション
        } else if (this.isInvalidFile) {
          this.isInvalidFile = true;
          this.isFile = false;
          return;
        } else if (!fileNameRegex.test(file.name)) {
          this.isFileCheck = true;
          this.isFile = false;
          return;
        } else {
          this.isInvalidFile = false;
          this.isFileCheck = false;
          this.isFile = true;
        }
      }
    },
    async edit() {
      const venueMap = this.getVenueMap();
      if ((!this.files || this.files.length === 0) && !venueMap.id) return;

      this.isPush.disabled = true;
      this.buttonState = "待機";

      try {
        const groupId =
          venueMap.group_id || venueMap.group?.id || this.$route.params.id;
        let pictureName = venueMap.picture_name || "";
        let picturePath = venueMap.picture_path || "";
        let imgurDeletehash = null;

        if (this.files && this.files.length > 0) {
          const file = this.files[0];
          this.state = "Uploading ...";
          const uploadedImage = await uploadImageToImgur(
            file,
            this.$config.imgurClientId
          );
          picturePath = uploadedImage.link;
          imgurDeletehash = uploadedImage.deletehash;
          pictureName = file.name;
        }

        const data = {
          group_id: groupId,
          picture_name: pictureName,
          picture_path: picturePath,
        };
        if (imgurDeletehash) {
          data.imgur_deletehash = imgurDeletehash;
        }

        const response =
          this.venueMap?.venue_map || venueMap.id
            ? await this.$axios.$put(`/venue_maps/${venueMap.id}`, data)
            : await this.$axios.$post(`/venue_maps?group_id=${groupId}`, data);

        this.$emit("saved", response.data.group_id);
        this.$emit("close");
        this.files = null;
      } catch (error) {
        console.error(error);
        this.$emit(
          "error",
          error?.response?.data?.message || error?.message || "保存に失敗しました"
        );
      } finally {
        this.isPush.disabled = false;
        this.buttonState = "登録";
        this.state = "";
      }
    },
  },
};
</script>
