use std::cell::RefCell;

// Canvas coordinates: x grows right; y grows down. Distances are game units.
const GRAVITY: f64 = 22.0;
const THRUST: f64 = 65.0;
const GROUND: f64 = 510.0;
const PAD_LEFT: f64 = 610.0;
const PAD_RIGHT: f64 = 750.0;
const FEET: f64 = 18.0;

#[derive(Clone, Copy)]
struct Flight {
    x: f64,
    y: f64,
    vx: f64,
    vy: f64,
    angle: f64,
    fuel: f64,
    outcome: u32, // 0: flying, 1: landed, 2: crashed
    burning: bool,
}

impl Flight {
    fn new() -> Self {
        Self {
            x: 270.0,
            y: 110.0,
            vx: 16.0,
            vy: 0.0,
            angle: 0.0,
            fuel: 100.0,
            outcome: 0,
            burning: false,
        }
    }

    fn step(&mut self, dt: f64, turn: f64, thrust: bool) {
        if self.outcome != 0 || !dt.is_finite() || !turn.is_finite() {
            return;
        }
        let dt = dt.clamp(0.0, 1.0 / 30.0);
        self.angle = (self.angle + turn.clamp(-1.0, 1.0) * 1.6 * dt).clamp(-1.2, 1.2);
        self.burning = thrust && self.fuel > 0.0;
        let power = if self.burning { THRUST } else { 0.0 };
        if self.burning {
            self.fuel = (self.fuel - 6.0 * dt).max(0.0);
        }
        self.vx += self.angle.sin() * power * dt;
        self.vy += (GRAVITY - self.angle.cos() * power) * dt;
        self.x += self.vx * dt;
        self.y += self.vy * dt;
        if self.y + FEET >= GROUND {
            let on_pad = self.x - 16.0 >= PAD_LEFT && self.x + 16.0 <= PAD_RIGHT;
            let gentle = self.vy.abs() <= 35.0 && self.vx.abs() <= 25.0 && self.angle.abs() <= 0.25;
            self.outcome = if on_pad && gentle { 1 } else { 2 };
            self.y = GROUND - FEET;
        }
        if self.x < 18.0 || self.x > 942.0 || self.y < 18.0 {
            self.outcome = 2;
        }
        if self.outcome != 0 {
            self.burning = false;
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn gravity_and_thrust_change_velocity_in_opposite_directions() {
        let mut fall = Flight::new();
        let mut burn = Flight::new();
        fall.step(0.02, 0.0, false);
        burn.step(0.02, 0.0, true);
        assert!(fall.vy > 0.0);
        assert!(burn.vy < 0.0 && burn.fuel < 100.0);
    }

    fn touchdown(x: f64, vy: f64, angle: f64) -> Flight {
        let mut f = Flight {
            x,
            y: GROUND - FEET - 0.1,
            vx: 0.0,
            vy,
            angle,
            ..Flight::new()
        };
        f.step(0.02, 0.0, false);
        f
    }

    #[test]
    fn only_a_slow_upright_landing_inside_the_pad_succeeds() {
        assert_eq!(touchdown(680.0, 10.0, 0.0).outcome, 1);
        assert_eq!(touchdown(680.0, 60.0, 0.0).outcome, 2);
        assert_eq!(touchdown(680.0, 10.0, 0.5).outcome, 2);
        assert_eq!(touchdown(200.0, 10.0, 0.0).outcome, 2);
    }

    #[test]
    fn empty_tank_and_finished_flights_do_not_keep_burning() {
        let mut f = Flight {
            fuel: 0.0,
            ..Flight::new()
        };
        f.step(0.02, 0.0, true);
        assert!(!f.burning && f.vy > 0.0);
        let mut landed = touchdown(680.0, 10.0, 0.0);
        let y = landed.y;
        landed.step(0.02, 1.0, true);
        assert_eq!(landed.y, y);
        assert!(!landed.burning);
    }
}

// One instance per browser game. No JS glue generator or external Rust crates.
thread_local! { static GAME: RefCell<Flight> = RefCell::new(Flight::new()); }

#[unsafe(no_mangle)]
pub extern "C" fn reset() {
    GAME.with(|g| *g.borrow_mut() = Flight::new());
}

#[unsafe(no_mangle)]
pub extern "C" fn step(dt: f64, turn: f64, thrust: u32) {
    GAME.with(|g| g.borrow_mut().step(dt, turn, thrust != 0));
}

// The small numeric ABI is decoded in engine.ts. No shared-memory layout assumptions.
#[unsafe(no_mangle)]
pub extern "C" fn read_state(index: u32) -> f64 {
    GAME.with(|g| {
        let f = g.borrow();
        match index {
            0 => f.x,
            1 => f.y,
            2 => f.vx,
            3 => f.vy,
            4 => f.angle,
            5 => f.fuel,
            6 => f.outcome as f64,
            7 => u32::from(f.burning) as f64,
            _ => 0.0,
        }
    })
}
