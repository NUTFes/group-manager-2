class ContactPersonsController < ApplicationController
before_action :set_contact_person, only: [:show, :update, :destroy]

    # GET /contact_persons
    # GET /contact_persons.json
    def index
        @contact_persons = ContactPerson.all
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
        @contact_person = ContactPerson.new(contact_person_params)
        if @contact_person.save
            render json: @contact_person
        else
            render json: @contact_person.errors, status: :unprocessable_entity
        end
    end

    # PATCH/PUT /contact_persons/1
    # PATCH/PUT /contact_persons/1.json
    def update
        if @contact_person.update(contact_person_params)
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
        @contact_person = ContactPerson.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def contact_person_params
        params.require(:contact_person).permit(:group_id, :name, :email)
    end
end
