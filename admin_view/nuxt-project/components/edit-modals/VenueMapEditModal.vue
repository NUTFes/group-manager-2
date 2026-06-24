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
            ファイル名は「参加形式_団体名」の形式で入力してください
          </div>
        </label>
      </div>
    </template>
    <template v-slot:method>
      <CommonButton
        iconName="edit"
        :disabled="isPush.disabled || !isFile"
        :on_click="edit"
        >{{ buttonState }}</CommonButton
      >
    </template>
  </EditModal>
</template>

<script>
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

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
        const fileNameRegex = /^[^\\/:*?"<>|\r\n]+_[^\\/:*?"<>|\r\n]+$/;

        if (this.isInvalidFile) {
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
    edit() {
      if (!this.files || this.files.length === 0) return;
      this.isPush.disabled = true;
      this.buttonState = "待機";
      for (const file of this.files) {
        const storageRef = ref(this.$storage, file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        this.run(uploadTask);
      }
    },
    run(uploadTask) {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = snapshot.bytesTransferred / snapshot.totalBytes;
          this.progress = progress * 100;
          switch (snapshot.state) {
            case "paused":
              this.buttonState = "待機";
              this.isPush.disabled = true;
              this.state = "paused";
              break;
            case "running":
              this.buttonState = "待機";
              this.isPush.disabled = true;
              this.state = "Uploading ... (" + this.progress.toFixed() + "%)";
              break;
          }
        },
        (error) => {
          console.error(error);
          this.isPush.disabled = false;
          this.buttonState = "登録";
          this.$emit(
            "error",
            error?.message || "ファイルのアップロードに失敗しました"
          );
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              const venueMap = this.getVenueMap();
              const groupId =
                venueMap.group_id ||
                venueMap.group?.id ||
                this.$route.params.id;
              const data = {
                group_id: groupId,
                picture_name: uploadTask.snapshot.ref.name,
                picture_path: downloadURL,
              };

              const handleAxiosError = (err) => {
                console.error(err);
                this.isPush.disabled = false;
                this.buttonState = "登録";
                this.$emit(
                  "error",
                  err?.response?.data?.message ||
                    err?.message ||
                    "保存に失敗しました"
                );
              };

              if (this.venueMap?.venue_map || venueMap.id) {
                const editUrl = `/venue_maps/${venueMap.id}`;
                this.$axios
                  .$put(editUrl, data)
                  .then((response) => {
                    this.$emit("saved", response.data.group_id);
                    this.$emit("close");
                    this.isPush.disabled = false;
                    this.files = null;
                  })
                  .catch(handleAxiosError);
              } else {
                const postUrl = `/venue_maps?group_id=${groupId}`;
                this.$axios
                  .$post(postUrl, data)
                  .then((response) => {
                    this.$emit("saved", response.data.group_id);
                    this.$emit("close");
                    this.isPush.disabled = false;
                    this.files = null;
                  })
                  .catch(handleAxiosError);
              }
            })
            .catch((err) => {
              console.error(err);
              this.isPush.disabled = false;
              this.buttonState = "登録";
              this.$emit(
                "error",
                err?.message || "ダウンロードURLの取得に失敗しました"
              );
            });
        }
      );
    },
  },
};
</script>
