import jsonwebtoken from 'jsonwebtoken';

const decodeToken = <T>(token: string) => {
    const jwtSecret = process.env.JWT_SECRET || '__SECRET_CHANGE_ME__';
    return jsonwebtoken.verify(token, jwtSecret) as unknown as T;
};

export default decodeToken;
