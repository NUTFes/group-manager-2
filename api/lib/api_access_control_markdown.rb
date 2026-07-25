# frozen_string_literal: true

require 'date'
require 'fileutils'
require Rails.root.join('lib/api_access_control_registry')

class ApiAccessControlMarkdown
  CATEGORY_ORDER = %w[authentication user staff manager].freeze
  CATEGORY_LABELS = {
    'authentication' => '未認証で利用できる認証フロー',
    'user' => 'user権限API',
    'staff' => 'staff権限API',
    'manager' => 'manager権限API'
  }.freeze
  ACCESS_RULES = {
    'authentication' => {
      authentication: '不要',
      roles: '未ログインを含む全利用者',
      errors: '各認証APIのバリデーションに従う'
    },
    'user' => {
      authentication: '必要',
      roles: 'user / staff / manager',
      errors: '未認証401、団体所有権不一致404'
    },
    'staff' => {
      authentication: '必要',
      roles: 'staff / manager',
      errors: '未認証401、userは403'
    },
    'manager' => {
      authentication: '必要',
      roles: 'manager',
      errors: '未認証401、user・staffは403'
    }
  }.freeze

  RouteEntry = Struct.new(:category, :http_method, :path, :action, keyword_init: true)

  def initialize(registry: ApiAccessControlRegistry.new, routes: Rails.application.routes.routes)
    @registry = registry
    @routes = routes
  end

  def render
    sections = CATEGORY_ORDER.map { |category| category_section(category) }

    <<~MARKDOWN
      # Group Manager API アクセス権限一覧

      > 生成日: #{Date.current.iso8601}
      >
      > 正本: `api/config/api_access_control.yml` と Rails routes
      >
      > 対象: Rails内部、Action Mailbox、Active Storage、Devise Token Auth内部を除く業務APIと、
      > 未認証で利用できる認証フロー

      ## 基本方針

      - 業務APIに未認証で利用できるPublic区分は設けない。
      - ロールは `user`（role_id 3）、`staff`（role_id 2）、`manager`（role_id 1）の3種類。
      - 上位ロールは下位区分のAPIも利用できる。
      - user区分の団体依存APIは、ログインユーザーが所有する団体内だけ参照・変更できる。
      - 未分類の業務ルートはデフォルト拒否する。

      ## 権限サマリ

      | 区分 | 認証 | 利用可能ロール | controller action数 | HTTPルート数 | 拒否・秘匿 |
      |---|---|---|---:|---:|---|
      #{summary_rows.join("\n")}

      ## HTTPステータスの意味

      | ステータス | 意味 |
      |---:|---|
      | 401 Unauthorized | ログインしていない、または認証トークンが無効 |
      | 403 Forbidden | ログイン済みだが必要なロールを持っていない |
      | 404 Not Found | user区分で別団体のIDを指定したため、存在を秘匿 |

      #{sections.join("\n\n")}

      ## 更新方法

      アクセス区分を変更した場合は `api/config/api_access_control.yml` を更新し、次のコマンドで再生成する。

      ```bash
      make api-access-docs
      ```
    MARKDOWN
  end

  def write(path)
    output_path = Pathname(path)
    FileUtils.mkdir_p(output_path.dirname)
    File.write(output_path, render)
    output_path
  end

  def route_entries
    entries = @routes.flat_map do |route|
      controller = route.defaults[:controller].to_s
      action = route.defaults[:action].to_s
      next [] if controller.empty? || action.empty?

      category = route_category(controller, action)
      next [] unless CATEGORY_ORDER.include?(category)

      route.verb.to_s.scan(/[A-Z]+/).map do |method|
        RouteEntry.new(
          category: category,
          http_method: method,
          path: normalized_path(route),
          action: "#{controller}##{action}"
        )
      end
    end

    @route_entries ||= entries.uniq.sort_by do |entry|
      [CATEGORY_ORDER.index(entry.category), entry.path, entry.http_method, entry.action]
    end
  end

  private

  def route_category(controller, action)
    return 'authentication' if @registry.unauthenticated_auth_action?(controller, action)

    @registry.category_for(controller, action)
  end

  def normalized_path(route)
    path = route.path.spec.to_s.delete_suffix('(.:format)')
    path.start_with?('/') ? path : "/#{path}"
  end

  def summary_rows
    CATEGORY_ORDER.map do |category|
      rule = ACCESS_RULES.fetch(category)
      [
        "| #{CATEGORY_LABELS.fetch(category)}",
        rule.fetch(:authentication),
        rule.fetch(:roles),
        action_count(category),
        entries_for(category).length,
        "#{rule.fetch(:errors)} |"
      ].join(' | ')
    end
  end

  def action_count(category)
    return entries_for(category).map(&:action).uniq.length if category == 'authentication'

    @registry.config
             .fetch('access')
             .fetch(category)
             .values
             .sum(&:length)
  end

  def category_section(category)
    rule = ACCESS_RULES.fetch(category)
    rows = entries_for(category).map do |entry|
      "| `#{entry.http_method}` | `#{entry.path}` | `#{entry.action}` |"
    end

    <<~MARKDOWN
      ## #{CATEGORY_LABELS.fetch(category)}

      - 認証: #{rule.fetch(:authentication)}
      - 利用可能: #{rule.fetch(:roles)}
      - 拒否・秘匿: #{rule.fetch(:errors)}

      | Method | Path | Controller#Action |
      |---|---|---|
      #{rows.join("\n")}
    MARKDOWN
  end

  def entries_for(category)
    route_entries.select { |entry| entry.category == category }
  end
end
