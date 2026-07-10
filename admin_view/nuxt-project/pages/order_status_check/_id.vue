<template>
  <div class="main-content">
    <SubHeader
      v-if="group"
      :pageTitle="group.group.name"
      pageSubTitle="申請状況一覧"
    >
    </SubHeader>

    <div v-if="loading">
      <p>読み込み中...</p>
    </div>

    <template v-else-if="group">
      <div class="side-nav side-nav-left">
        <button
          type="button"
          class="side-nav-button"
          :disabled="!prevGroupId"
          aria-label="前の団体へ移動"
          @click="onPrevGroup"
        >
          <span class="side-nav-icon">&lt;</span>
        </button>
      </div>
      <div class="side-nav side-nav-right">
        <button
          type="button"
          class="side-nav-button"
          :disabled="!nextGroupId"
          aria-label="次の団体へ移動"
          @click="onNextGroup"
        >
          <span class="side-nav-icon">&gt;</span>
        </button>
      </div>
      <Row
        wrap="nowrap"
        align="start"
        justify="space-between"
        style="margin-top: 20px"
      >
        <Column width="70%" align="start" justify="start">
          <Card
            width="100%"
            height="800px"
            style="
              overflow-y: auto;
              align-items: flex-start;
              gap: 24px;
              padding: 40px;
            "
          >
            <!-- 基本情報 -->
            <div style="width: 100%">
              <div class="section-header">
                <h2>基本情報</h2>
              </div>
              <VerticalTable>
                <tbody
                  class="selectable-row"
                  @click="openModal('group', group.group)"
                >
                  <tr>
                    <th>団体名</th>
                    <td>{{ group.group.name }}</td>
                  </tr>
                  <tr>
                    <th>企画名</th>
                    <td>{{ group.group.project_name }}</td>
                  </tr>
                  <tr>
                    <th>活動内容</th>
                    <td style="white-space: pre-line">
                      {{ group.group.activity }}
                    </td>
                  </tr>
                  <tr>
                    <th>参加団体の情報</th>
                    <td>
                      {{
                        [
                          group.group.committee ? "実行委員" : null,
                          group.group.is_international ? "国際" : null,
                          group.group.is_external ? "学外" : null,
                        ]
                          .filter(Boolean)
                          .join("・") || "なし"
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th>参加形式</th>
                    <td>{{ group.group_category || "未設定" }}</td>
                  </tr>
                  <tr>
                    <th>代表者</th>
                    <td>{{ group.user ? group.user.name : "未登録" }}</td>
                  </tr>
                  <tr>
                    <th>代表者メール</th>
                    <td>
                      <a
                        v-if="group.user"
                        class="mail-link"
                        :href="'mailto:' + group.user.email"
                        @click.stop
                      >
                        {{ group.user.email }}
                      </a>
                      <span v-else>未登録</span>
                    </td>
                  </tr>

                  <tr
                    :class="{ 'selectable-row': !!group.sub_rep }"
                    @click.stop="
                      group.sub_rep ? openModal('sub_rep', group.sub_rep) : null
                    "
                  >
                    <th>副代表</th>
                    <td>
                      <template v-if="isUnregistered('sub_rep')">
                        申請しない
                      </template>
                      <template v-else-if="group.sub_rep">
                        {{ group.sub_rep.name }}
                      </template>
                      <template v-else>未登録</template>
                    </td>
                  </tr>
                </tbody>
              </VerticalTable>
              <HorizontalRule style="margin-top: 24px" />
            </div>

            <!-- 会場申請 -->
            <div v-if="shouldShow('place_order')" style="width: 100%">
              <div class="section-header">
                <h2>会場申請</h2>
              </div>
              <p v-if="isUnregistered('place_order')">申請しない</p>
              <VerticalTable v-else-if="group.place_order">
                <tbody
                  class="selectable-row"
                  @click="openModal('place_order', group.place_order)"
                >
                  <tr>
                    <th>第1希望</th>
                    <td>{{ group.place_order.first }}</td>
                  </tr>
                  <tr>
                    <th>第2希望</th>
                    <td>{{ group.place_order.second }}</td>
                  </tr>
                  <tr>
                    <th>第3希望</th>
                    <td>{{ group.place_order.third }}</td>
                  </tr>
                  <tr>
                    <th>備考</th>
                    <td>{{ group.place_order.remark }}</td>
                  </tr>
                </tbody>
              </VerticalTable>

              <p v-else>未登録</p>
              <HorizontalRule style="margin-top: 24px" />
            </div>

            <!-- 物品申請 -->
            <div v-if="shouldShow('rental_orders')" style="width: 100%">
              <div class="section-header-with-button">
                <h2>物品申請</h2>
                <div
                  class="status-select-with-icon"
                  v-if="!isUnregistered('rental_item_order')"
                  :class="
                    getStatusSelectClass(getSubmissionStatusValue('equipment'))
                  "
                >
                  <span class="material-icons status-icon">
                    {{
                      getStatusMeta(getSubmissionStatusValue("equipment")).icon
                    }}
                  </span>
                  <div class="select-wrapper">
                    <select
                      class="status-select"
                      :class="
                        getStatusSelectClass(
                          getSubmissionStatusValue('equipment')
                        )
                      "
                      :value="getSubmissionStatusValue('equipment')"
                      @change="onStatusChange('equipment', $event.target.value)"
                    >
                      <option
                        v-for="option in statusOptions"
                        :key="option.value"
                        :value="option.value"
                        :disabled="option.value === 'unsubmitted'"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                    <span class="material-icons select-caret"
                      >arrow_drop_down</span
                    >
                  </div>
                </div>
              </div>
              <p v-if="isUnregistered('rental_item_order')">申請しない</p>
              <VerticalTable
                v-else-if="group.rental_orders && group.rental_orders.length > 0"
              >
                <tr>
                  <th>物品名</th>
                  <th>数量</th>
                </tr>
                <tr
                  v-for="(orderWrapper, index) in group.rental_orders"
                  :key="index"
                  class="selectable-row"
                  @click="openModal('rental_order', orderWrapper)"
                >
                  <td>{{ orderWrapper.rental_item.name }}</td>
                  <td>
                    {{
                      orderWrapper.rental_item.num !== undefined
                        ? orderWrapper.rental_item.num
                        : "不明"
                    }}
                  </td>
                </tr>
              </VerticalTable>

              <p v-else>未登録</p>
              <HorizontalRule style="margin-top: 24px" />
            </div>

            <!-- ステージ申請 -->
            <div v-if="shouldShow('stage_orders')" style="width: 100%">
              <div class="section-header">
                <h2>ステージ申請</h2>
              </div>
              <p v-if="isUnregistered('stage_order')">申請しない</p>
              <VerticalTable
                v-else-if="group.stage_orders && group.stage_orders.length > 0"
              >
                <tr>
                  <th>天気</th>
                  <th>希望ステージ</th>
                  <th>準備・片付け・演奏時間</th>
                </tr>
                <tr
                  v-for="(orderWrapper, index) in group.stage_orders"
                  :key="index"
                  class="selectable-row"
                  @click="openModal('stage_order', orderWrapper)"
                >
                  <td>
                    {{ formatWeather(orderWrapper.stage_order.is_sunny) }}
                  </td>
                  <td>
                    1: {{ orderWrapper.stage_order.stage_first_name }}<br />
                    2: {{ orderWrapper.stage_order.stage_second_name }}
                  </td>
                  <td>
                    【時間(分)】<br />
                    準備:
                    {{
                      orderWrapper.stage_order.prepare_time_interval || "未設定"
                    }}
                    / 演奏:
                    {{
                      orderWrapper.stage_order.use_time_interval || "未設定"
                    }}
                    / 片付け:
                    {{
                      orderWrapper.stage_order.cleanup_time_interval || "未設定"
                    }}
                  </td>
                </tr>
              </VerticalTable>

              <p v-else>未登録</p>
              <HorizontalRule style="margin-top: 24px" />
            </div>

            <!-- ステージオプション -->
            <div v-if="shouldShow('stage_common_option')" style="width: 100%">
              <div class="section-header">
                <h2>ステージオプション</h2>
              </div>
              <p v-if="isUnregistered('stage_common_option')">申請しない</p>
              <VerticalTable v-else-if="group.stage_common_option">
                <tbody
                  class="selectable-row"
                  @click="
                    openModal('stage_common_option', group.stage_common_option)
                  "
                >
                  <tr>
                    <th>自前音源</th>
                    <td>
                      {{ group.stage_common_option.own_equipment ? "〇" : "×" }}
                    </td>
                  </tr>
                  <tr>
                    <th>BGM使用</th>
                    <td>{{ group.stage_common_option.bgm ? "〇" : "×" }}</td>
                  </tr>
                  <tr>
                    <th>撮影許可</th>
                    <td>
                      {{
                        group.stage_common_option.camera_permission ? "〇" : "×"
                      }}
                    </td>
                  </tr>
                  <tr>
                    <th>大きな音</th>
                    <td>
                      {{ group.stage_common_option.loud_sound ? "〇" : "×" }}
                    </td>
                  </tr>
                </tbody>
              </VerticalTable>

              <p v-else>未登録</p>
              <HorizontalRule style="margin-top: 24px" />
            </div>

            <!-- 消費電力申請 -->
            <div v-if="shouldShow('power_orders')" style="width: 100%">
              <div class="section-header-with-button">
                <h2>電力申請</h2>
                <div
                  class="status-select-with-icon"
                  v-if="!isUnregistered('power_order')"
                  :class="
                    getStatusSelectClass(
                      getSubmissionStatusValue('power_order')
                    )
                  "
                >
                  <span class="material-icons status-icon">
                    {{
                      getStatusMeta(getSubmissionStatusValue("power_order"))
                        .icon
                    }}
                  </span>
                  <div class="select-wrapper">
                    <select
                      class="status-select"
                      :class="
                        getStatusSelectClass(
                          getSubmissionStatusValue('power_order')
                        )
                      "
                      :value="getSubmissionStatusValue('power_order')"
                      @change="
                        onStatusChange('power_order', $event.target.value)
                      "
                    >
                      <option
                        v-for="option in statusOptions"
                        :key="option.value"
                        :value="option.value"
                        :disabled="option.value === 'unsubmitted'"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                    <span class="material-icons select-caret"
                      >arrow_drop_down</span
                    >
                  </div>
                </div>
              </div>
              <p v-if="isUnregistered('power_order')">申請しない</p>
              <VerticalTable
                v-else-if="group.power_orders && group.power_orders.length > 0"
              >
                <tr>
                  <th>製品名</th>
                  <th>電力(W)</th>
                  <th>メーカー</th>
                  <th>型番</th>
                  <th>URL</th>
                </tr>
                <tr
                  v-for="(orderWrapper, index) in group.power_orders"
                  :key="index"
                  class="selectable-row"
                  @click="openModal('power_order', orderWrapper)"
                >
                  <td>{{ orderWrapper.power_order.item }}</td>
                  <td>{{ orderWrapper.power_order.power }}</td>
                  <td>{{ orderWrapper.power_order.manufacturer }}</td>
                  <td>{{ orderWrapper.power_order.model }}</td>
                  <td>
                    <a
                      v-if="orderWrapper.power_order.item_url"
                      :href="orderWrapper.power_order.item_url"
                      target="_blank"
                      rel="noopener noreferrer"
                      @click.stop
                      >{{ orderWrapper.power_order.item_url }}</a
                    >
                    <span v-else>-</span>
                  </td>
                </tr>
              </VerticalTable>

              <p v-else>未登録</p>
              <HorizontalRule style="margin-top: 24px" />
            </div>

            <!-- PR情報 -->
            <div v-if="shouldShow('public_relation')" style="width: 100%">
              <div class="section-header">
                <h2>PR情報</h2>
              </div>
              <p v-if="isUnregistered('public_relation')">申請しない</p>
              <VerticalTable v-else-if="group.public_relation">
                <tbody
                  class="selectable-row"
                  @click="openModal('public_relation', group.public_relation)"
                >
                  <tr>
                    <th>PR文</th>
                    <td style="white-space: pre-line">
                      {{ group.public_relation.blurb }}
                    </td>
                  </tr>
                  <tr>
                    <th>PR画像</th>
                    <td>
                      <div
                        v-if="group.public_relation.picture_path"
                        @click.stop="
                          openImage(group.public_relation.picture_path)
                        "
                        style="cursor: pointer; width: 100%"
                      >
                        <img
                          :src="group.public_relation.picture_path"
                          alt="PR画像"
                          style="width: 100%; height: auto; display: block"
                        />
                      </div>
                      <span v-else>未登録</span>
                    </td>
                  </tr>
                </tbody>
              </VerticalTable>

              <p v-else>未登録</p>
              <HorizontalRule style="margin-top: 24px" />
            </div>

            <!-- 従業員申請 -->
            <div v-if="shouldShow('employees')" style="width: 100%">
              <div class="section-header-with-button">
                <h2>従業員申請</h2>
                <div
                  class="status-select-with-icon"
                  v-if="!isUnregistered('employee')"
                  :class="
                    getStatusSelectClass(getSubmissionStatusValue('employee'))
                  "
                >
                  <span class="material-icons status-icon">
                    {{
                      getStatusMeta(getSubmissionStatusValue("employee")).icon
                    }}
                  </span>
                  <div class="select-wrapper">
                    <select
                      class="status-select"
                      :class="
                        getStatusSelectClass(
                          getSubmissionStatusValue('employee')
                        )
                      "
                      :value="getSubmissionStatusValue('employee')"
                      @change="onStatusChange('employee', $event.target.value)"
                    >
                      <option
                        v-for="option in statusOptions"
                        :key="option.value"
                        :value="option.value"
                        :disabled="option.value === 'unsubmitted'"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                    <span class="material-icons select-caret"
                      >arrow_drop_down</span
                    >
                  </div>
                </div>
              </div>
              <p v-if="isUnregistered('employee')">申請しない</p>
              <VerticalTable
                v-else-if="group.employees && group.employees.length > 0"
              >
                <tr>
                  <th>氏名</th>
                  <th>学籍番号</th>
                  <th>検便状況</th>
                </tr>
                <tr
                  v-for="(empWrapper, index) in group.employees"
                  :key="index"
                  class="selectable-row"
                  @click="openModal('employee', empWrapper)"
                >
                  <td>{{ empWrapper.employee.name }}</td>
                  <td>{{ empWrapper.employee.student_id }}</td>
                  <td>{{ empWrapper.employee.stool_test || "未登録" }}</td>
                </tr>
              </VerticalTable>

              <p v-else>未登録</p>
              <HorizontalRule style="margin-top: 24px" />
            </div>

            <!-- 模擬店平面図 -->
            <div v-if="shouldShow('venue_map')" style="width: 100%">
              <div class="section-header-with-button">
                <h2>模擬店平面図</h2>
                <div class="section-actions">
                  <CommonButton iconName="edit" :on_click="() => openModal('venue_map', { ...group.venue_map, group_name: group.group.name })">編集</CommonButton>
                  <div
                    class="status-select-with-icon"
                  v-if="!isUnregistered('venue_map')"
                  :class="
                    getStatusSelectClass(getSubmissionStatusValue('venue_map'))
                  "
                >
                  <span class="material-icons status-icon">
                    {{
                      getStatusMeta(getSubmissionStatusValue("venue_map")).icon
                    }}
                  </span>
                  <div class="select-wrapper">
                    <select
                      class="status-select"
                      :class="
                        getStatusSelectClass(
                          getSubmissionStatusValue('venue_map')
                        )
                      "
                      :value="getSubmissionStatusValue('venue_map')"
                      @change="onStatusChange('venue_map', $event.target.value)"
                    >
                      <option
                        v-for="option in statusOptions"
                        :key="option.value"
                        :value="option.value"
                        :disabled="option.value === 'unsubmitted'"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                    <span class="material-icons select-caret"
                      >arrow_drop_down</span
                    >
                  </div>
                </div>
                </div>
              </div>
              <p v-if="isUnregistered('venue_map')">申請しない</p>
              <div
                v-else-if="group.venue_map"
                class="selectable-row"
                @click="openPreviewModal"
                style="width: 100%"
              >
                <img
                  v-if="group.venue_map.picture_path"
                  :src="group.venue_map.picture_path"
                  alt="平面図"
                  class="venue-map-image"
                  style="width: 100%; height: auto; display: block"
                />
              </div>

              <p v-else>未登録</p>
              <HorizontalRule style="margin-top: 24px" />
            </div>

            <!-- 販売品申請 -->
            <div v-if="shouldShow('food_products')" style="width: 100%">
              <div class="section-header-with-button">
                <h2>販売品申請</h2>
                <div
                  class="status-select-with-icon"
                  v-if="!isUnregistered('food_product')"
                  :class="
                    getStatusSelectClass(
                      getSubmissionStatusValue('food_product')
                    )
                  "
                >
                  <span class="material-icons status-icon">
                    {{
                      getStatusMeta(getSubmissionStatusValue("food_product"))
                        .icon
                    }}
                  </span>
                  <div class="select-wrapper">
                    <select
                      class="status-select"
                      :class="
                        getStatusSelectClass(
                          getSubmissionStatusValue('food_product')
                        )
                      "
                      :value="getSubmissionStatusValue('food_product')"
                      @change="
                        onStatusChange('food_product', $event.target.value)
                      "
                    >
                      <option
                        v-for="option in statusOptions"
                        :key="option.value"
                        :value="option.value"
                        :disabled="option.value === 'unsubmitted'"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                    <span class="material-icons select-caret"
                      >arrow_drop_down</span
                    >
                  </div>
                </div>
              </div>
              <p v-if="isUnregistered('food_product')">申請しない</p>
              <VerticalTable
                v-else-if="group.food_products && group.food_products.length > 0"
              >
                <tr>
                  <th>販売品名</th>
                  <th>調理</th>
                  <th>1日目</th>
                  <th>2日目</th>
                </tr>
                <tr
                  v-for="(fpWrapper, index) in group.food_products"
                  :key="index"
                  class="selectable-row"
                  @click="openModal('food_product', fpWrapper)"
                >
                  <td>{{ fpWrapper.food_product.name }}</td>
                  <td>{{ fpWrapper.food_product.is_cooking ? "〇" : "×" }}</td>
                  <td>{{ fpWrapper.food_product.first_day_num }}個</td>
                  <td>{{ fpWrapper.food_product.second_day_num }}個</td>
                </tr>
              </VerticalTable>

              <p v-else>未登録</p>
              <HorizontalRule style="margin-top: 24px" />
            </div>

            <!-- 購入品申請 -->
            <div v-if="shouldShow('purchase_list')" style="width: 100%">
              <div class="section-header-with-button">
                <h2>購入品申請</h2>
                <div
                  class="status-select-with-icon"
                  v-if="!isUnregistered('purchase_list')"
                  :class="
                    getStatusSelectClass(
                      getSubmissionStatusValue('purchase_list')
                    )
                  "
                >
                  <span class="material-icons status-icon">
                    {{
                      getStatusMeta(getSubmissionStatusValue("purchase_list"))
                        .icon
                    }}
                  </span>
                  <div class="select-wrapper">
                    <select
                      class="status-select"
                      :class="
                        getStatusSelectClass(
                          getSubmissionStatusValue('purchase_list')
                        )
                      "
                      :value="getSubmissionStatusValue('purchase_list')"
                      @change="
                        onStatusChange('purchase_list', $event.target.value)
                      "
                    >
                      <option
                        v-for="option in statusOptions"
                        :key="option.value"
                        :value="option.value"
                        :disabled="option.value === 'unsubmitted'"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                    <span class="material-icons select-caret"
                      >arrow_drop_down</span
                    >
                  </div>
                </div>
              </div>
              <p v-if="isUnregistered('purchase_list')">申請しない</p>
              <div v-else-if="group.food_products && group.food_products.length > 0">
                <div
                  v-for="(fpWrapper, index) in group.food_products"
                  :key="index"
                  style="margin-bottom: 20px"
                >
                  <h4 style="margin-bottom: 8px">
                    {{ fpWrapper.food_product.name }}
                  </h4>
                  <VerticalTable
                    v-if="
                      fpWrapper.purchase_lists &&
                      fpWrapper.purchase_lists.length > 0
                    "
                  >
                    <tr>
                      <th>品目</th>
                      <th>購入日</th>
                      <th>なまもの</th>
                      <th>購入先</th>
                      <th>URL</th>
                      <th>備考</th>
                    </tr>
                    <tr
                      v-for="(plWrapper, j) in fpWrapper.purchase_lists"
                      :key="j"
                      class="selectable-row"
                      @click="openModal('purchase_list', plWrapper)"
                    >
                      <td>{{ plWrapper.purchase_list.items }}</td>
                      <td>{{ plWrapper.purchase_list.purchase_date }}</td>
                      <td>
                        {{ plWrapper.purchase_list.is_fresh ? "〇" : "×" }}
                      </td>
                      <td>{{ plWrapper.purchase_list.shop }}</td>
                      <td>
                        <a
                          v-if="plWrapper.purchase_list.url"
                          :href="plWrapper.purchase_list.url"
                          target="_blank"
                          rel="noopener noreferrer"
                          @click.stop
                          >{{ plWrapper.purchase_list.url }}</a
                        >
                        <span v-else>-</span>
                      </td>
                      <td>{{ plWrapper.purchase_list.remark }}</td>
                    </tr>
                  </VerticalTable>
                  <p
                    v-else-if="isUnregistered('purchase_list')"
                    style="margin-bottom: 16px; margin-left: 8px"
                  >
                    購入品申請しない
                  </p>
                  <p v-else style="margin-bottom: 16px; margin-left: 8px">
                    購入品未登録
                  </p>
                </div>
              </div>

              <p v-else>未登録</p>
              <HorizontalRule style="margin-top: 24px" />
            </div>

            <!-- 調理工程申請 -->
            <div v-if="shouldShow('cooking_process_order')" style="width: 100%">
              <div class="section-header-with-button">
                <h2>調理工程申請</h2>
                <div
                  class="status-select-with-icon"
                  v-if="!isUnregistered('cooking_process_order')"
                  :class="
                    getStatusSelectClass(
                      getSubmissionStatusValue('cooking_process_order')
                    )
                  "
                >
                  <span class="material-icons status-icon">
                    {{
                      getStatusMeta(
                        getSubmissionStatusValue("cooking_process_order")
                      ).icon
                    }}
                  </span>
                  <div class="select-wrapper">
                    <select
                      class="status-select"
                      :class="
                        getStatusSelectClass(
                          getSubmissionStatusValue('cooking_process_order')
                        )
                      "
                      :value="getSubmissionStatusValue('cooking_process_order')"
                      @change="
                        onStatusChange(
                          'cooking_process_order',
                          $event.target.value
                        )
                      "
                    >
                      <option
                        v-for="option in statusOptions"
                        :key="option.value"
                        :value="option.value"
                        :disabled="option.value === 'unsubmitted'"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                    <span class="material-icons select-caret"
                      >arrow_drop_down</span
                    >
                  </div>
                </div>
              </div>
              <p v-if="isUnregistered('cooking_process_order')">申請しない</p>
              <div v-else-if="group.food_products && group.food_products.length > 0">
                <div
                  v-for="(fpWrapper, index) in group.food_products"
                  :key="index"
                  style="margin-bottom: 20px"
                >
                  <h4 style="margin-bottom: 8px">
                    {{ fpWrapper.food_product.name }}
                  </h4>
                  <VerticalTable v-if="fpWrapper.cooking_process_order">
                    <tbody
                      class="selectable-row"
                      @click="
                        openModal(
                          'cooking_process_order',
                          fpWrapper.cooking_process_order
                        )
                      "
                    >
                      <tr>
                        <th>調理工程</th>
                        <td style="white-space: pre-line">
                          <template
                            v-if="fpWrapper.cooking_process_order.tent_ja"
                          >
                            {{ fpWrapper.cooking_process_order.tent_ja
                            }}<br /><br />
                            {{ "<翻訳前の原文>" }}<br />
                            {{
                              fpWrapper.cooking_process_order.tent || "未入力"
                            }}
                          </template>
                          <template v-else>
                            {{
                              fpWrapper.cooking_process_order.tent || "未入力"
                            }}
                          </template>
                        </td>
                      </tr>
                      <tr>
                        <th>営業前調理</th>
                        <td>
                          {{
                            fpWrapper.cooking_process_order.pre_open_kitchen
                              ? "〇"
                              : "×"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <th>営業中調理</th>
                        <td>
                          {{
                            fpWrapper.cooking_process_order.during_open_kitchen
                              ? "〇"
                              : "×"
                          }}
                        </td>
                      </tr>
                    </tbody>
                  </VerticalTable>
                  <p v-else-if="isUnregistered('cooking_process_order')">
                    申請しない
                  </p>
                  <p v-else>調理工程未登録</p>
                </div>
              </div>
              <p v-else>未登録</p>
              <HorizontalRule style="margin-top: 24px" />
            </div>

            <!-- 火気使用申請 -->
            <div v-if="shouldShow('fire_equipment_orders')" style="width: 100%">
              <div class="section-header-with-button">
                <h2>火気使用申請</h2>
                <div
                  class="status-select-with-icon"
                  v-if="!isUnregistered('fire_equipment_order')"
                  :class="
                    getStatusSelectClass(
                      getSubmissionStatusValue('fire_equipment_order')
                    )
                  "
                >
                  <span class="material-icons status-icon">
                    {{
                      getStatusMeta(
                        getSubmissionStatusValue("fire_equipment_order")
                      ).icon
                    }}
                  </span>
                  <div class="select-wrapper">
                    <select
                      class="status-select"
                      :class="
                        getStatusSelectClass(
                          getSubmissionStatusValue('fire_equipment_order')
                        )
                      "
                      :value="getSubmissionStatusValue('fire_equipment_order')"
                      @change="
                        onStatusChange(
                          'fire_equipment_order',
                          $event.target.value
                        )
                      "
                    >
                      <option
                        v-for="option in statusOptions"
                        :key="option.value"
                        :value="option.value"
                        :disabled="option.value === 'unsubmitted'"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                    <span class="material-icons select-caret"
                      >arrow_drop_down</span
                    >
                  </div>
                </div>
              </div>
              <p v-if="isUnregistered('fire_equipment_order')">申請しない</p>
              <VerticalTable
                v-else-if="
                  group.fire_equipment_orders &&
                  group.fire_equipment_orders.length > 0
                "
              >
                <tr>
                  <th>火気設備名</th>
                  <th>数量</th>
                  <th>燃料</th>
                  <th>使用目的</th>
                  <th>持ち帰り</th>
                  <th>備考</th>
                </tr>
                <tr
                  v-for="(orderWrapper, index) in group.fire_equipment_orders"
                  :key="index"
                  class="selectable-row"
                  @click="openModal('fire_equipment_order', orderWrapper)"
                >
                  <td>{{ orderWrapper.fire_equipment_order.name }}</td>
                  <td>{{ orderWrapper.fire_equipment_order.quantity }}</td>
                  <td>{{ orderWrapper.fire_equipment_order.fuel_japanese }}</td>
                  <td>{{ orderWrapper.fire_equipment_order.usage }}</td>
                  <td>
                    {{
                      orderWrapper.fire_equipment_order.is_takeaway ? "〇" : "×"
                    }}
                  </td>
                  <td>{{ orderWrapper.fire_equipment_order.remark }}</td>
                </tr>
              </VerticalTable>
              <p v-else>未登録</p>
              <HorizontalRule style="margin-top: 24px" />
            </div>
          </Card>
        </Column>

        <Column
          width="30%"
          align="start"
          justify="start"
          class="sticky-right-column"
        >
          <GroupMailSender
            v-if="group.group.id"
            :group-id="group.group.id"
            :user-email="group.user ? group.user.email : ''"
            source-page="order_status"
            :group-name="group.group.name"
            :user-name="group.user ? group.user.name : ''"
          />
        </Column>
      </Row>
    </template>

    <component
      v-if="isOpenEditModal"
      :is="activeModalComponent"
      v-bind="dynamicProps"
      @saved="onEditorSaved"
      @close="closeModal"
    />
    <!-- プレビューモーダル (平面図 & 物品申請) -->
    <transition name="fade" appear>
      <div v-if="isPreviewModalOpen" class="preview-modal" @click.self="closePreviewModal">
        <div class="preview-modal__container">
          <div class="preview-modal__box">
            <div class="preview-modal__header">
              <h2>模擬店平面図 & 物品申請</h2>
              <CommonButton iconName="close" :on_click="closePreviewModal">閉じる</CommonButton>
            </div>
            <div class="preview-modal__content">
              <div class="preview-modal__left">
                <img v-if="group.venue_map && group.venue_map.picture_path" :src="group.venue_map.picture_path" alt="平面図" class="preview-modal__image" />
                <p v-else>画像がありません</p>
              </div>
              <div class="preview-modal__right">
                <VerticalTable v-if="group.rental_orders && group.rental_orders.length > 0">
                  <tr>
                    <th>貸出物品</th>
                    <th>数量</th>
                  </tr>
                  <tr v-for="(orderWrapper, index) in group.rental_orders" :key="index">
                    <td>{{ orderWrapper.rental_item.name }}</td>
                    <td>{{ orderWrapper.rental_item.num !== undefined ? orderWrapper.rental_item.num : "不明" }}</td>
                  </tr>
                </VerticalTable>
                <p v-else>物品申請はありません</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import CookingProcessOrderEditModal from "~/components/edit-modals/CookingProcessOrderEditModal.vue";
import EmployeeEditModal from "~/components/edit-modals/EmployeeEditModal.vue";
import FireEquipmentOrderEditModal from "~/components/edit-modals/FireEquipmentOrderEditModal.vue";
import FoodProductEditModal from "~/components/edit-modals/FoodProductEditModal.vue";
import GroupEditModal from "~/components/edit-modals/GroupEditModal.vue";
import PlaceOrderEditModal from "~/components/edit-modals/PlaceOrderEditModal.vue";
import PowerOrderEditModal from "~/components/edit-modals/PowerOrderEditModal.vue";
import PublicRelationEditModal from "~/components/edit-modals/PublicRelationEditModal.vue";
import PurchaseListEditModal from "~/components/edit-modals/PurchaseListEditModal.vue";
import RentalOrderEditModal from "~/components/edit-modals/RentalOrderEditModal.vue";
import StageCommonOptionEditModal from "~/components/edit-modals/StageCommonOptionEditModal.vue";
import StageOrderEditModal from "~/components/edit-modals/StageOrderEditModal.vue";
import SubRepEditModal from "~/components/edit-modals/SubRepEditModal.vue";
import VenueMapEditModal from "~/components/edit-modals/VenueMapEditModal.vue";
import GroupMailSender from "~/components/GroupMailSender.vue";
import { formatWeather } from "~/utils/constants";

const HEALTH_CENTER_STATUS_UPDATE_ENDPOINT =
  "/api/v1/health_center_submission_statuses";

export default {
  components: {
    GroupEditModal,
    SubRepEditModal,
    PlaceOrderEditModal,
    PowerOrderEditModal,
    RentalOrderEditModal,
    StageOrderEditModal,
    StageCommonOptionEditModal,
    EmployeeEditModal,
    FoodProductEditModal,
    PurchaseListEditModal,
    CookingProcessOrderEditModal,
    FireEquipmentOrderEditModal,
    PublicRelationEditModal,
    VenueMapEditModal,
    GroupMailSender,
  },
  data() {
    return {
      group: null,
      loading: true,
      unregisteredGroups: [],
      allGroupIds: [],
      activeEditType: null,
      selectedItem: null,
      isOpenEditModal: false,
      submissions: [],
      isPreviewModalOpen: false,
      statusOptions: [
        { value: "unapproved", label: "未確認" },
        { value: "waiting_resubmission", label: "再提出待ち" },
        { value: "approved", label: "承認済み" },
        { value: "unsubmitted", label: "未提出" },
      ],
    };
  },
  computed: {
    currentGroupId() {
      const id = Number(this.$route.params.id);
      return Number.isNaN(id) ? null : id;
    },
    currentGroupIndex() {
      if (!this.currentGroupId || this.allGroupIds.length === 0) return -1;
      return this.allGroupIds.indexOf(this.currentGroupId);
    },
    prevGroupId() {
      if (this.currentGroupIndex <= 0) return null;
      return this.allGroupIds[this.currentGroupIndex - 1];
    },
    nextGroupId() {
      if (
        this.currentGroupIndex < 0 ||
        this.currentGroupIndex >= this.allGroupIds.length - 1
      )
        return null;
      return this.allGroupIds[this.currentGroupIndex + 1];
    },
    activeModalComponent() {
      if (!this.activeEditType) return null;
      const pascalCase = this.activeEditType
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join("");
      return pascalCase + "EditModal";
    },
    dynamicProps() {
      if (!this.activeEditType) return {};
      // 団体情報のモーダルの場合、prop名を 'group' とします（元は group.group で渡されている）
      if (this.activeEditType === "group") {
        return { group: this.selectedItem };
      }
      const camelCase = this.activeEditType.replace(/_([a-z])/g, (g) =>
        g[1].toUpperCase()
      );
      return { [camelCase]: this.selectedItem };
    },
  },
  watch: {
    "$route.params.id": {
      async handler() {
        await this.fetchData();
      },
    },
  },
  async mounted() {
    await this.fetchData();
    await this.fetchAllGroupIds();
  },
  methods: {
    formatWeather,
    async fetchData(silent = false) {
      if (!silent) this.loading = true;
      try {
        const [orderInfoRes, unregRes, submissionRes] = await Promise.all([
          this.$axios.$get(
            `/api/v1/get_order_info_for_admin_view/${this.$route.params.id}`
          ),
          this.$axios.$get(
            `/un_registered_groups?group_id=${this.$route.params.id}`
          ),
          this.$axios
            .$get(
              `/api/v1/get_health_center_submission_status_show_for_admin_view/${this.$route.params.id}`
            )
            .catch(() => ({ data: { submissions: [] } })),
        ]);
        this.group = orderInfoRes.data;
        this.unregisteredGroups = unregRes.data || [];
        this.submissions = submissionRes.data?.submissions || [];
      } catch (error) {
        if (error.response && error.response.status === 401) {
          this.$router.push("/");
        } else {
          console.error(error);
        }
      } finally {
        if (!silent) {
          this.loading = false;
          window.scrollTo(0, 0);
        }
      }
    },
    async fetchAllGroupIds() {
      try {
        const currentYearRes = await this.$axios.$get("/user_page_settings/1");
        const url =
          "/api/v1/get_refinement_order_status_check?fes_year_id=" +
          currentYearRes.data.fes_year_id;
        const refRes = await this.$axios.$post(url);

        if (refRes && refRes.data) {
          this.allGroupIds = refRes.data
            .map((g) => g.group.id)
            .sort((a, b) => a - b);
        }
      } catch (e) {
        console.error("Failed to fetch all group ids", e);
      }
    },
    isUnregistered(orderType) {
      return this.unregisteredGroups.some(
        (item) => item.order_type === orderType
      );
    },
    shouldShow(itemKey) {
      if (!this.group || !this.group.group) return false;

      const categoryId = this.group.group.group_category_id;
      const isInternational = this.group.group.is_international;

      switch (itemKey) {
        case "place_order":
        case "venue_map":
          return categoryId !== 3; // 展示以外
        case "stage_orders":
        case "stage_common_option":
          return categoryId === 3; // ステージのみ
        case "employees":
        case "cooking_process_order":
        case "purchase_list":
          return categoryId === 1; // 模擬店(食品)のみ
        case "food_products":
          return categoryId === 1 || categoryId === 2; // 模擬店(食品)と模擬店(物品)
        case "fire_equipment_orders":
          return [1, 2, 4, 5].includes(categoryId);
        default:
          return true; // power_orders, rental_orders, public_relation 等は基本表示
      }
    },
    onPrevGroup() {
      if (this.prevGroupId) {
        this.$router.push(`/order_status_check/${this.prevGroupId}`);
      }
    },
    onNextGroup() {
      if (this.nextGroupId) {
        this.$router.push(`/order_status_check/${this.nextGroupId}`);
      }
    },
    openModal(type, item) {
      this.activeEditType = type;
      this.selectedItem = item;
      this.isOpenEditModal = true;
    },
    closeModal() {
      this.isOpenEditModal = false;
      this.activeEditType = null;
      this.selectedItem = null;
    },
    openPreviewModal() {
      this.isPreviewModalOpen = true;
    },
    closePreviewModal() {
      this.isPreviewModalOpen = false;
    },
    getSubmission(applicationType) {
      return this.submissions.find(
        (submission) => submission.application_type === applicationType
      );
    },
    getSubmissionStatusValue(applicationType) {
      const submission = this.getSubmission(applicationType);
      const status = submission?.status;
      return this.normalizeStatus(status);
    },
    normalizeStatus(value) {
      if (
        value === false ||
        value === null ||
        value === undefined ||
        value === ""
      ) {
        return "unsubmitted";
      }
      return value;
    },
    getStatusMeta(status) {
      const statusMap = {
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

      return statusMap[status] || statusMap.unapproved;
    },
    getStatusSelectClass(value) {
      const classMap = {
        unapproved: "status-select--unapproved",
        waiting_resubmission: "status-select--waiting-resubmission",
        approved: "status-select--approved",
        unsubmitted: "status-select--unsubmitted",
      };

      return classMap[value] || classMap.unapproved;
    },
    async onStatusChange(applicationType, status) {
      const submission = this.getSubmission(applicationType);
      const payload = {
        group_id: this.group.group.id,
        application_type: applicationType,
        status,
      };

      if (submission?.id) {
        payload.health_center_submission_status_id = submission.id;
      }

      const response = await this.$axios.$post(
        HEALTH_CENTER_STATUS_UPDATE_ENDPOINT,
        payload
      );

      const savedSubmission = this.getSubmission(applicationType);
      if (savedSubmission) {
        savedSubmission.id = response.data.id;
        savedSubmission.status = response.data.status;
      } else {
        this.submissions.push({
          application_type: applicationType,
          id: response.data.id,
          status: response.data.status,
        });
      }
    },
    openImage(url) {
      window.open(url, "_blank", "noopener,noreferrer");
    },
    async onEditorSaved() {
      await this.fetchData(true);
    },
  },
};
</script>

<style scoped>
.section-header {
  margin-bottom: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}
.venue-map-image {
  border: 1px solid #ccc;
  border-radius: 4px;
}
.selectable-row {
  cursor: pointer;
  transition: background-color 0.2s;
}
.selectable-row:hover {
  background-color: #f9fafb;
}
.selectable-card {
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}
.selectable-card:hover {
  background-color: #f9fafb;
}
.selectable-card-body {
  width: 100%;
}

.side-nav {
  position: fixed;
  top: 50vh;
  transform: translateY(-50%);
  z-index: 20;
}

.side-nav-left {
  left: calc(260px + 60px - 56px);
}

.side-nav-right {
  right: calc(60px - 56px);
}

.side-nav-button {
  min-width: 20px;
  width: 20px;
  height: 56px;
  padding: 0;
  letter-spacing: 0;
  gap: 0;
  font-size: 10px;
  border-radius: 10px;
  border: 1px solid #c9ccd1;
  box-shadow: none;
  backdrop-filter: none;
  color: #6b7280;
  background: #ffffff;
  opacity: 0.9;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.side-nav-icon {
  font-size: 14px;
  line-height: 1;
}

.side-nav-button:hover {
  background: #f3f4f6;
  border-color: #b8bcc2;
  color: #4b5563;
  opacity: 1;
}

.side-nav-button:disabled {
  background: #f9fafb;
  border-color: #e5e7eb;
  color: #9ca3af;
  opacity: 1;
  cursor: not-allowed;
}

.comment-form {
  width: 100%;
  padding: 0;
  margin: 0;
}

.comment-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.comment-history {
  width: 100%;
  margin-top: 16px;
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
}

.comment-textarea:focus {
  outline: none;
  border-color: var(--button-primary);
}

.comment-textarea:disabled {
  background: #f5f5f5;
  color: #777;
  cursor: not-allowed;
}

.sticky-right-column {
  position: sticky;
  top: 16px;
}

@media (max-width: 900px) {
  .sticky-right-column {
    position: static;
    top: auto;
  }

  .side-nav-left {
    left: 8px;
  }

  .side-nav-right {
    right: 8px;
  }

  .side-nav-button {
    min-width: 18px;
    width: 18px;
    height: 46px;
    border-radius: 8px;
  }

  .side-nav-icon {
    font-size: 12px;
  }
}

.section-header-with-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.status-select-with-icon {
  min-width: 170px;
  height: 34px;
  border: 1px solid var(--accent-2);
  border-radius: 4px;
  padding: 0 8px;
  background: #fff;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.status-icon {
  font-size: 18px;
  color: var(--accent-7);
}
.status-select {
  min-width: 130px;
  height: 34px;
  border: none;
  padding: 0 2px;
  background: transparent;
  color: #222 !important;
  -webkit-text-fill-color: #222;
}
.status-select:focus {
  outline: none;
}
.status-select option {
  color: #222;
  background: #ffffff;
}
.status-select-with-icon.status-select--unapproved {
  background: #e53935 !important;
  color: #fff !important;
}
.status-select-with-icon.status-select--waiting-resubmission {
  background: #2e7d32 !important;
  color: #fff !important;
}
.status-select-with-icon.status-select--approved {
  background: transparent !important;
  color: #111827 !important;
}
.status-select-with-icon.status-select--unsubmitted {
  background: #ffb300 !important;
  color: #fff !important;
}
.status-select-with-icon.status-select--unapproved .status-select,
.status-select-with-icon.status-select--waiting-resubmission .status-select,
.status-select-with-icon.status-select--unsubmitted .status-select {
  color: #fff !important;
  -webkit-text-fill-color: #fff !important;
}
.status-select-with-icon.status-select--approved .status-select {
  color: inherit !important;
  -webkit-text-fill-color: inherit !important;
  background: transparent !important;
}
.select-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
}
.select-wrapper .status-select {
  -webkit-appearance: none;
  appearance: none;
  padding-right: 20px;
}
.select-caret {
  position: absolute;
  right: 6px;
  pointer-events: none;
  color: #6b7280;
  font-size: 18px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f3f4f6;
  border-radius: 6px;
  padding: 2px 6px;
}
.select-wrapper:hover .select-caret {
  background: #e6e9ee;
  color: #374151;
}
.status-select-with-icon.status-select--unapproved .select-caret,
.status-select-with-icon.status-select--unapproved .status-icon,
.status-select-with-icon.status-select--waiting-resubmission .select-caret,
.status-select-with-icon.status-select--waiting-resubmission .status-icon,
.status-select-with-icon.status-select--unsubmitted .select-caret,
.status-select-with-icon.status-select--unsubmitted .status-icon {
  background: transparent !important;
  color: #fff !important;
}
.status-select-with-icon.status-select--approved .select-caret,
.status-select-with-icon.status-select--approved .status-icon {
  background: transparent !important;
  color: #111827 !important;
}

.section-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* プレビューモーダル */
.preview-modal {
  top: 0;
  left: 0;
  position: fixed;
  height: 100vh;
  width: 100vw;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.preview-modal__container {
  width: 95vw;
  max-width: 1600px;
  height: 95vh;
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.preview-modal__box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.preview-modal__header {
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.preview-modal__header h2 {
  margin: 0;
  font-size: 20px;
}
.preview-modal__content {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.preview-modal__left {
  flex: 1;
  padding: 16px;
  overflow: hidden;
  border-right: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
}
.preview-modal__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.preview-modal__right {
  width: 400px;
  padding: 24px;
  overflow-y: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
