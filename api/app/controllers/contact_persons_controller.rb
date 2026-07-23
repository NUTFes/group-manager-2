# frozen_string_literal: true

class ContactPersonsController < ApplicationController
  before_action :set_contact_person, only: %i[show update destroy]

  # GET /contact_persons
  # GET /contact_persons.json
  def index
    @contact_persons = participant_scope(ContactPerson)
    render json: @contact_persons
  end

  # GET /contact_persons/1
  # GET /contact_persons/1.json
  def show
    render json: @contact_person
  end

  # POST /contact_persons
  # POST /contact_persons.json
  def create
    group = current_api_user_group!(contact_person_params[:group_id])
    return unless group

    @contact_person = ContactPerson.new(contact_person_params.merge(group_id: group.id))
    if @contact_person.save
      render json: @contact_person
    else
      render json: @contact_person.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /contact_persons/1
  # PATCH/PUT /contact_persons/1.json
  def update
    attrs = contact_person_params
    return if attrs[:group_id].present? && !current_api_user_group!(attrs[:group_id])

    if @contact_person.update(attrs)
      render json: @contact_person
    else
      render json: @contact_person.errors, status: :unprocessable_entity
    end
  end

  # DELETE /contact_persons/1
  # DELETE /contact_persons/1.json
  def destroy
    @contact_person.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_contact_person
    @contact_person = participant_record!(ContactPerson, params[:id])
  end

  # Only allow a list of trusted parameters through.
  def contact_person_params
    params.require(:contact_person).permit(:group_id, :name, :email)
  end
end
