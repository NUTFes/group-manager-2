import re

with open('admin_view/nuxt-project/pages/order_status_check/_id.vue', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Basic Info updates
basic_info_old = """            <VerticalTable>
              <tr>
                <th>団体名</th>
                <td>{{ group.group.name }}</td>
              </tr>
              <tr>
                <th>参加形式</th>
                <td>{{ group.group_category || "未設定" }}</td>
              </tr>
              <tr>
                <th>企画名</th>
                <td>{{ group.group.project_name }}</td>
              </tr>
              <tr>
                <th>代表者</th>
                <td>{{ group.user ? group.user.name : "未登録" }}</td>
              </tr>
              <tr>
                <th>代表者メール</th>
                <td>
                  <a v-if="group.user" class="mail-link" :href="'mailto:' + group.user.email">
                    {{ group.user.email }}
                  </a>
                  <span v-else>未登録</span>
                </td>
              </tr>
              <tr class="selectable-row" @click="group.sub_rep ? openModal('sub_rep', group.sub_rep) : null">"""

basic_info_new = """            <VerticalTable>
              <tbody class="selectable-row" @click="openModal('group', group.group)">
                <tr>
                  <th>団体名</th>
                  <td>{{ group.group.name }}</td>
                </tr>
                <tr>
                  <th>参加形式</th>
                  <td>{{ group.group_category || "未設定" }}</td>
                </tr>
                <tr>
                  <th>企画名</th>
                  <td>{{ group.group.project_name }}</td>
                </tr>
                <tr>
                  <th>代表者</th>
                  <td>{{ group.user ? group.user.name : "未登録" }}</td>
                </tr>
                <tr>
                  <th>代表者メール</th>
                  <td>
                    <a v-if="group.user" class="mail-link" :href="'mailto:' + group.user.email" @click.stop>
                      {{ group.user.email }}
                    </a>
                    <span v-else>未登録</span>
                  </td>
                </tr>
              </tbody>
              <tr class="selectable-row" @click="group.sub_rep ? openModal('sub_rep', group.sub_rep) : null">"""

content = content.replace(basic_info_old, basic_info_new)

# 2. Extract Cards
def extract_card(content, header_text):
    pattern = re.compile(r'(<Card width="100%" v-if="shouldShow\(\'[^<]*?\).*?<h2>' + header_text + r'</h2>.*?</Card>)', re.DOTALL)
    match = pattern.search(content)
    if match:
        return match.group(1)
    return None

def remove_card(content, header_text):
    pattern = re.compile(r'[ \t]*<!-- .*? -->\n[ \t]*<Card width="100%" v-if="shouldShow\(\'[^<]*?\).*?<h2>' + header_text + r'</h2>.*?</Card>\n', re.DOTALL)
    return pattern.sub('', content)

cards = {
    'place': extract_card(content, '会場申請'),
    'power': extract_card(content, '消費電力申請'),
    'rental': extract_card(content, '物品申請'),
    'stage': extract_card(content, 'ステージ申請'),
    'stage_opt': extract_card(content, 'ステージオプション'),
    'employee': extract_card(content, '従業員申請'),
    'food': extract_card(content, '販売品・購入品・調理工程申請'),
    'pr': extract_card(content, 'PR情報'),
    'announcement': extract_card(content, 'アナウンス'),
    'map': extract_card(content, '模擬店平面図'),
    'fire': extract_card(content, '火気使用申請'),
}

# Remove all cards from content
for key, title in [('place', '会場申請'), ('power', '消費電力申請'), ('rental', '物品申請'), 
                   ('stage', 'ステージ申請'), ('stage_opt', 'ステージオプション'), ('employee', '従業員申請'), 
                   ('food', '販売品・購入品・調理工程申請'), ('pr', 'PR情報'), ('announcement', 'アナウンス'), 
                   ('map', '模擬店平面図'), ('fire', '火気使用申請')]:
    content = remove_card(content, title)

# Split food card into three
food_card_new = """
          <!-- 販売品申請 -->
          <Card width="100%" v-if="shouldShow('food_products')">
            <div class="section-header">
              <h2>販売品申請</h2>
            </div>
            <VerticalTable v-if="group.food_products && group.food_products.length > 0">
              <tr>
                <th>販売品名</th>
                <th>1日目</th>
                <th>2日目</th>
              </tr>
              <tr v-for="(fpWrapper, index) in group.food_products" :key="index" class="selectable-row" @click="openModal('food_product', fpWrapper)">
                <td>{{ fpWrapper.food_product.name }}</td>
                <td>{{ fpWrapper.food_product.first_day_num }}個</td>
                <td>{{ fpWrapper.food_product.second_day_num }}個</td>
              </tr>
            </VerticalTable>
            <p v-else-if="isUnregistered('food_product')">申請しない</p>
            <p v-else>未登録</p>
          </Card>

          <!-- 購入品申請 -->
          <Card width="100%" v-if="shouldShow('purchase_list')">
            <div class="section-header">
              <h2>購入品申請</h2>
            </div>
            <div v-if="group.food_products && group.food_products.length > 0">
              <div v-for="(fpWrapper, index) in group.food_products" :key="index" style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 8px;">{{ fpWrapper.food_product.name }}</h4>
                <VerticalTable v-if="fpWrapper.purchase_lists && fpWrapper.purchase_lists.length > 0">
                  <tr>
                    <th>品目</th>
                    <th>購入日</th>
                    <th>なまもの</th>
                    <th>購入先</th>
                    <th>URL</th>
                    <th>備考</th>
                  </tr>
                  <tr v-for="(plWrapper, j) in fpWrapper.purchase_lists" :key="j" class="selectable-row" @click="openModal('purchase_list', plWrapper)">
                    <td>{{ plWrapper.purchase_list.items }}</td>
                    <td>{{ plWrapper.purchase_list.purchase_date }}</td>
                    <td>{{ plWrapper.purchase_list.is_fresh ? '〇' : '×' }}</td>
                    <td>{{ plWrapper.purchase_list.shop }}</td>
                    <td>
                      <a v-if="plWrapper.purchase_list.url" :href="plWrapper.purchase_list.url" target="_blank" rel="noopener noreferrer" @click.stop>リンク</a>
                      <span v-else>-</span>
                    </td>
                    <td>{{ plWrapper.purchase_list.remark }}</td>
                  </tr>
                </VerticalTable>
                <p v-else-if="isUnregistered('purchase_list')">購入品申請しない</p>
                <p v-else>購入品未登録</p>
              </div>
            </div>
            <p v-else-if="isUnregistered('purchase_list')">申請しない</p>
            <p v-else>未登録</p>
          </Card>

          <!-- 調理工程申請 -->
          <Card width="100%" v-if="shouldShow('cooking_process_order')">
            <div class="section-header">
              <h2>調理工程申請</h2>
            </div>
            <div v-if="group.food_products && group.food_products.length > 0">
              <div v-for="(fpWrapper, index) in group.food_products" :key="index" style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 8px;">{{ fpWrapper.food_product.name }}</h4>
                <VerticalTable v-if="fpWrapper.cooking_process_order">
                  <tbody class="selectable-row" @click="openModal('cooking_process_order', fpWrapper.cooking_process_order)">
                    <tr>
                      <th>調理工程</th>
                      <td style="white-space: pre-line">{{ fpWrapper.cooking_process_order.tent }}</td>
                    </tr>
                    <tr>
                      <th>営業前調理</th>
                      <td>{{ fpWrapper.cooking_process_order.pre_open_kitchen ? "〇" : "×" }}</td>
                    </tr>
                    <tr>
                      <th>営業中調理</th>
                      <td>{{ fpWrapper.cooking_process_order.during_open_kitchen ? "〇" : "×" }}</td>
                    </tr>
                  </tbody>
                </VerticalTable>
                <p v-else-if="isUnregistered('cooking_process_order')">申請しない</p>
                <p v-else>調理工程未登録</p>
              </div>
            </div>
            <p v-else-if="isUnregistered('cooking_process_order')">申請しない</p>
            <p v-else>未登録</p>
          </Card>
"""

# Reconstruct cards in correct order
ordered_cards = [
    '<!-- 会場申請 -->\n          ' + cards['place'],
    '<!-- 物品申請 -->\n          ' + cards['rental'],
    '<!-- ステージ申請 -->\n          ' + cards['stage'],
    '<!-- ステージオプション -->\n          ' + cards['stage_opt'],
    '<!-- 消費電力申請 -->\n          ' + cards['power'],
    '<!-- PR情報 -->\n          ' + cards['pr'],
    '<!-- 従業員申請 -->\n          ' + cards['employee'],
    '<!-- 模擬店平面図 -->\n          ' + cards['map'],
    food_card_new.strip('\n'),
    '<!-- 火気使用申請 -->\n          ' + cards['fire'],
]

cards_str = '\n\n          '.join(ordered_cards) + '\n\n        </Column>'

# Replace the closing tag area
content = re.sub(r'[ \t]*</Column>', cards_str, content)

# 3. Add GroupEditModal import
import_statement = 'import GroupEditModal from "~/components/edit-modals/GroupEditModal.vue";\n'
content = content.replace('import SubRepEditModal from "~/components/edit-modals/SubRepEditModal.vue";', 
                          import_statement + 'import SubRepEditModal from "~/components/edit-modals/SubRepEditModal.vue";')

# 4. Add GroupEditModal to components
content = content.replace('SubRepEditModal,', 'GroupEditModal,\n    SubRepEditModal,')

with open('admin_view/nuxt-project/pages/order_status_check/_id.vue', 'w', encoding='utf-8') as f:
    f.write(content)

print("Rewrite complete")
