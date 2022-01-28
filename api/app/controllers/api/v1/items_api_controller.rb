class Api::V1::ItemsApiController < ApplicationController
  
  def get_rentable_items
    @items = RentalItem.where(is_rentable: true) 
    render json: fmt(ok, @items)
  end

end
