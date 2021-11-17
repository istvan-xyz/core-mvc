export const userFromTokenData = <T>(
    userClass: { new (): T },
    data: Partial<T>
) => {
    const user = new userClass();

    for (const [key, value] of Object.entries(data)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (user as any)[key as keyof T] = value;
    }

    return user;
};
