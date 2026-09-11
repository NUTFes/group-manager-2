# frozen_string_literal: true

json.array! @memos, partial: 'memos/memo', as: :memo
