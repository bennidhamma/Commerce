require 'mscorlib'
include System::Collections::Generic
include ForgottenArts::Commerce
include System

load_assembly 'System.Core'
using_clr_extensions System::Linq
using_clr_extensions ForgottenArts::Commerce

class AttackEvent
  attr_accessor :roll
  attr_accessor :attacker
  attr_accessor :defender
  attr_accessor :city_walls
end

class DiscoveryEvent
  attr_accessor :roll
end

class Object
    def to_seq(type = Object)
        System::Linq::Enumerable.method(:of_type).of(type).call(self.to_a)
    end

    def to_arr(type = Object)
        System::Array.of(type).new(self.to_a)
    end

    def discovery_roll(roll, args, game, player)
      pop = ((2 + rand(6) + rand(6)) / 2).round
      # Allow other cards to modify discovery roll.
      event = DiscoveryEvent.new
      event.roll = roll
      player.handle_card_events "DiscoveryEvent", event
      roll = event.roll
      case roll
      when 1..10
        args.trash_card = true
        log = "lost a ship"
      when 11..30
        log = "found nothing"
      when 31..90
        if player.hexes.count < 9
          player.add_hex pop
          log = "found a hex"
        end
      else
        if player.hexes.count < 9
          player.add_hex pop, (1 + rand(6))
          log = "found a hex with friendly natives"
        end
      end
      game.log "#{player.name} rolled on the discovery table and " + log
    end

    def attack_roll(roll, args, game, hex, player)
      event = AttackEvent.new
      event.roll = roll
      event.attacker = player
      event.defender = hex.player
      player.handle_card_events "AttackEvent", event
      roll = event.roll
      case roll
      when 1..10
        args.trash_card = true
        log = "Defeat! Card is trashed."
      when 11..60
        log = "Defeat!"
      when 60..70
        hex.player.discard_to 3
        log = "Enemy player discards to 3."
      when 70..80
        hex.has_colony = false
        hex.current_population - hex.population_limit
        log = "Victory! Enemry colony is reduced."
        if hex.player.trade_cards.count 
          card = hex.player.trade_cards.sample.card
          hex.player.give_trade_card player, card
          log += " Enemy player surrended one " + card
        end
      when 80..90
        hex.has_colony = false
        hex.current_population = 0
        log = "Victory! Enemry colony is destroyed."
        if hex.player.trade_cards.count 
          card = hex.player.trade_cards.sample.card
          hex.player.give_trade_card player, card
          log += " Enemy player surrended one " + card
        end
      else
        if player.add_hex hex
          hex.player.hexes.remove hex
        end
        log = "Victory! Enemy colony is captured!"
        if hex.player.trade_cards.count 
          card = hex.player.trade_cards.sample.card
          hex.player.give_trade_card player, card
          log += " Enemy player surrended one " + card
        end
      end
      game.log "#{player.name} attacked #{hex.player.name} and ... " + log
    end
end
