import Elysia, { t } from "elysia";
import { authenticate } from "../libs/auth";
import { deleteImage, updateImage, uploadImage } from "../services/supabase/utils";
import { successResponse } from "../utils/responseBuilder";
import { ErrorWithStatus } from "../utils/exceptionBuilder";

const routes = (app: Elysia) =>
    app
        .use(authenticate)
        .group('/image', (app) =>
            app
                .delete('/delete/*',
                    async ({ params }) => {
                        const response = await deleteImage(params['*']);

                        if (response.length === 0)
                            throw new ErrorWithStatus('Incorrect image path', 400, 'Bad Request');

                        return successResponse({
                            message: `Image is successfully deleted`,
                            data: response
                        })

                    },
                    {
                        params: t.Object({
                            '*': t.String({ error: 'ID must be in correct format (string)' })
                        })
                    }
                )
                .group('/collect', (app) =>
                    app
                        .post('/',
                            async ({ userId, body }) => {
                                const img = await uploadImage(
                                    `/collect/${userId}`,
                                    body.img
                                );

                                return successResponse({
                                    message: 'Image upload success',
                                    data: [img]
                                })
                            },
                            {
                                body: t.Object({
                                    img: t.File({ maxSize: '8m', maxItems: 1, type: 'image', error: 'One image file with 8MB maximum size only' })
                                }),
                            }
                        )
                        .patch('/*',
                            async ({ body, params }) => {
                                console.log(params);

                                const img = await updateImage(
                                    params['*'],
                                    body.img
                                );

                                return successResponse({
                                    message: 'Image upload success',
                                    data: [img]
                                })
                            },
                            {
                                body: t.Object({
                                    img: t.File({ maxSize: '8m', maxItems: 1, type: 'image', error: 'One image file with 8MB maximum size only' })
                                }),
                                params: t.Object({
                                    '*': t.String({ error: 'ID must be in correct format (string)' })
                                })
                            }
                        )
                )
                .group('/report', (app) =>
                    app
                        .post('/',
                            async ({ userId, body }) => {
                                const img = await uploadImage(
                                    `/report/${userId}`,
                                    body.img
                                );

                                return successResponse({
                                    message: 'Image upload success',
                                    data: [img]
                                })
                            },
                            {
                                body: t.Object({
                                    img: t.File({ maxSize: '8m', maxItems: 1, type: 'image', error: 'One image file with 8MB maximum size only' })
                                })
                            }
                        )
                        .patch('/*',
                            async ({ params, body }) => {
                                const img = await updateImage(
                                    params['*'],
                                    body.img
                                );

                                return successResponse({
                                    message: 'Image upload success',
                                    data: [img]
                                })
                            },
                            {
                                body: t.Object({
                                    img: t.File({ maxSize: '8m', maxItems: 1, type: 'image', error: 'One image file with 8MB maximum size only' })
                                }),
                                params: t.Object({
                                    '*': t.String({ error: 'ID must be in correct format (string)' })
                                })
                            }
                        )
                )
        )

export default routes;