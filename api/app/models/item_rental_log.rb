# frozen_string_literal: true

class ItemRentalLog < ApplicationRecord
  belongs_to :stocker_place
  belongs_to :rental_item
  belongs_to :group
  belongs_to :assign_rental_item, optional: true

  # NOTE: 2 (absolute_adjustment) is kept as a deprecated, read-only category so that
  # historical rows are not silently reinterpreted as rental_absolute. New records must
  # use rental_absolute/return_absolute instead (enforced by the exclusion validation below).
  enum :category, {
    rental: 0,
    return: 1,
    absolute_adjustment: 2,
    rental_absolute: 3,
    return_absolute: 4,
    addition: 5,
    reduction: 6
  }

  ASSIGNMENT_CHANGE_CATEGORIES = %w[addition reduction].freeze
  DEPRECATED_CATEGORIES = %w[absolute_adjustment].freeze
  # 上限を超えたときのメッセージに出す、上限の呼び名
  QUANTITY_LIMIT_LABELS = {
    'rental' => '貸出残',
    'return' => '返却残',
    'rental_absolute' => '実効割当数',
    'return_absolute' => '貸出済数'
  }.freeze

  validates :uid, presence: true, uniqueness: true
  validates :category, presence: true
  validates :category, exclusion: { in: DEPRECATED_CATEGORIES, message: 'は廃止されました' }, on: :create
  validates :quantity, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :recorder_email, presence: true
  validates :assign_rental_item, presence: true, unless: -> { category.in?(ASSIGNMENT_CHANGE_CATEGORIES) }
  validates :assign_rental_item, absence: true, if: -> { category.in?(ASSIGNMENT_CHANGE_CATEGORIES) }
  validate :quantity_within_limit, on: :create

  private

  # 当日の記録は上限を超えられない（設計書5章）。画面とBFFでも制限しているが、
  # BFF用のトークンさえあればAPIを直接叩けるため、保存時にもここで確かめる。
  #
  # addition / reduction は割当に紐づかず、上限（提供元の未貸出数）も割当1件では
  # 決まらないため、超過貸出のエンドポイント側で確かめる。
  def quantity_within_limit
    return if quantity.nil? || assign_rental_item.nil?

    limit = quantity_limit
    return if limit.nil? || quantity <= limit

    errors.add(:quantity, "は#{limit}以下にしてください（#{quantity_limit_label}）")
  end

  def quantity_limit
    case category
    when 'rental' then assign_rental_item.lent_remaining
    when 'return' then assign_rental_item.return_remaining
    # 訂正は「訂正後の累計」を入れるので、上限は累計そのものの上限になる
    when 'rental_absolute' then assign_rental_item.effective_num
    when 'return_absolute' then assign_rental_item.lent_quantity
    end
  end

  def quantity_limit_label
    QUANTITY_LIMIT_LABELS[category]
  end
end
