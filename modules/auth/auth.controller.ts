import * as express from 'express';
import * as passport from 'passport';
import {Request, Response, NextFunction} from 'express';
import {AuthService} from '@/modules/auth/auth.service';
import * as jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('login', {session: false}, (err, user) => {
        if (err) return next(err);

        try {
            return res.json({token: user});
        } catch (err) {
            next(err);
        }
    })(req, res, next);
});

router.post('/register', (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('register', {session: false}, (err) => {
        if (err) return next(err);

        try {
            return res.json({success: true});
        } catch (err) {
            next(err);
        }
    })(req, res, next);
});

router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.json(req.user);
    } catch (err) {
        next(err);
    }
});

router.post('/logout', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await AuthService.logout(req.user);
        res.json(result);
    } catch (err) {
        next(err);
    }
});

router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = jwt.sign(
            {
                id: req.user.id,
                username: req.user.username,
            },
            process.env.JWT_SECRET as string,
            {expiresIn: '1h'}
        );

        res.json({token});
    } catch (err) {
        next(err);
    }
});

export default router;
