class Api::V1::StageCommonOptionsApiController < ApplicationController

    def get_stage_common_options_with_group
        stage_common_options = StageCommonOption.all
        stage_common_options_with_group = []
        for s in stage_common_options 
            group = s.group.name
            stage_common_options_with_group << {
                stage_common_option: s,
                group: group,
            }
        end 
        render json: stage_common_options_with_group
    end

    def get_stage_common_option_with_group
        stage_common_option = StageCommonOption.find(params[:id])
        group = stage_common_option.group.name
        stage_common_option_with_group = {
          stage_common_option: stage_common_option,
          group: group
        }
        render json: stage_common_option_with_group
    end

    #絞り込み機能
    def get_refinement_stage_common_options
        fes_year_id = params[:fes_year_id].to_i
        own_equipment = params[:own_equipment]        
        bgm = params[:bgm]
        camera_permission = params[:camera_permission]
        loud_sound = params[:loud_sound]
        if fes_year_id != 0
            @stage_common_options = Group.where(fes_year_id: fes_year_id).preload(:stage_common_option).map{ |group| group.stage_common_option }
            if own_equipment
                @stage_common_options = StageCommonOption.where(own_equipment: own_equipment).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
                if bgm 
                    @stage_common_options = StageCommonOption.where(own_equipment: own_equipment).where(bgm: bgm).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
                    if camera_permission 
                        @stage_common_options = StageCommonOption.where(own_equipment: own_equipment).where(bgm: bgm).where(camera_permission: camera_permission).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
                        if loud_sound
                            @stage_common_options = StageCommonOption.where(own_equipment: own_equipment).where(bgm: bgm).where(camera_permission: camera_permission).where(loud_sound: loud_sound).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
                        end
                    else
                        if loud_sound
                            @stage_common_options = StageCommonOption.where(own_equipment: own_equipment).where(bgm: bgm).where(loud_sound: loud_sound).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
                        end
                    end
                else
                    if camera_permission
                        @stage_common_options = StageCommonOption.where(own_equipment: own_equipment).where(camera_permission: camera_permission).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
                        if loud_sound
                            @stage_common_options = StageCommonOption.where(own_equipment: own_equipment).where(camera_permission: camera_permission).where(loud_sound: loud_sound).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
                        end
                    else
                        if loud_sound
                            @stage_common_options = StageCommonOption.where(own_equipment: own_equipment).where(loud_sound: loud_sound).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
                        end
                    end
                end
            else
                if bgm
                    @stage_common_options = StageCommonOption.where(bgm: bgm).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
                    if camera_permission
                        @stage_common_options = StageCommonOption.where(bgm: bgm).where(camera_permission: camera_permission).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
                        if loud_sound
                            @stage_common_options = StageCommonOption.where(bgm: bgm).where(camera_permission: camera_permission).where(loud_sound: loud_sound).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
                        end
                    else
                        if loud_sound
                            @stage_common_options = StageCommonOption.where(bgm: bgm).where(loud_sound: loud_sound).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
                        end    
                    end
                else
                    if camera_permission
                        @stage_common_options = StageCommonOption.where(camera_permission: camera_permission).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
                        if loud_sound
                            @stage_common_options = StageCommonOption.where(camera_permission: camera_permission).where(loud_sound: loud_sound).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
                        end
                    else
                        if loud_sound
                            @stage_common_options = StageCommonOption.where(loud_sound: loud_sound).map{ |stage_common_option| stage_common_option if stage_common_option.group.fes_year_id == fes_year_id }.compact
                        end
                    end    
                end
            end
        else 
            if own_equipment
                @stage_common_options = StageCommonOption.where(own_equipment: own_equipment)
                if bgm 
                    @stage_common_options = StageCommonOption.where(own_equipment: own_equipment).where(bgm: bgm)
                    if camera_permission
                        @stage_common_options = StageCommonOption.where(own_equipment: own_equipment).where(bgm: bgm).where(camera_permission: camera_permission)
                        if loud_sound
                            @stage_common_options = StageCommonOption.where(own_equipment: own_equipment).where(bgm: bgm).where(camera_permission: camera_permission).where(loud_sound: loud_sound)
                        end    
                    else
                        if loud_sound
                            @stage_common_options = StageCommonOption.where(own_equipment: own_equipment).where(bgm: bgm).where(loud_sound: loud_sound) 
                        end
                    end    
                else    
                    if camera_permission 
                        @stage_common_options = StageCommonOption.where(own_equipment: own_equipment).where(camera_permission: camera_permission)
                        if loud_sound
                            @stage_common_options = StageCommonOption.where(own_equipment).where(camera_permission: camera_permission).where(loud_sound: loud_sound)
                        end
                    else
                        if loud_sound 
                            @stage_common_options = StageCommonOption.where(own_equipment: own_equipment).where(loud_sound)
                        end
                    end
                end
            else
                if bgm 
                    @stage_common_options = StageCommonOption.where(bgm: bgm)
                    if camera_permission
                        @stage_common_options = StageCommonOption.where(bgm:bgm).where(camera_permission: camera_permission)
                        if loud_sound
                            @stage_common_options = StageCommonOption.where(bgm: bgm).where(camera_permission: camera_permission).where(loud_sound: loud_sound)
                        end
                    else    
                        if loud_sound
                            @stage_common_options = StageCommonOption.where(bgm: bgm).where(loud_sound: loud_sound)
                        end
                    end
                else
                    if camera_permission
                        @stage_common_options = StageCommonOption.where(camera_permission: camera_permission)
                        if loud_sound
                            @stage_common_options = StageCommonOption.where(camera_permission: camera_permission).where(loud_sound: loud_sound)
                        end
                    else
                        if loud_sound
                            @stage_common_options = StageCommonOption.where(loud_sound: loud_sound)
                        else
                            @stage_common_options = StageCommonOption.all 
                        end
                    end
                end        
            end
        end
        
        if @stage_common_options.count == 0  
            render json: fmt(not_found, [], "Not found stage_common_options")
        else 
            render json: fmt(ok, @stage_common_options)
        end
    end    

    #あいまい検索
    def get_search_stage_common_options
        word = params[:word]
        @stage_common_options = Group.where("name like ?", "%#{word}%").preload(:stage_common_option).map{ |group| group.stage_common_option } 
        if @stage_common_options.count == 0
          render json: fmt(not_found, [], "Not found stage_common_options")
        else
          render json: fmt(ok, @stage_common_options)
        end
      end
    
end
