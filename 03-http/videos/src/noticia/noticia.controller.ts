// noticia.controller.ts

import {Body, Controller, Get, Param, Post, Query, Res} from "@nestjs/common";
import {Noticia} from "../app.controller";
import {NoticiaService} from "./noticia.service";

@Controller('noticia')
export class NoticiaController {

    constructor(private readonly _noticiaService: NoticiaService) {

    }

    @Get('inicio')
    async inicio(
        @Res() response,
        @Query() consulta,
        @Query('accion') accion: string,
        @Query('titulo') titulo: string
    ) {

        let mensaje = undefined;

        if (accion && titulo) {
            switch (accion) {
                case 'borrar':
                    mensaje = `Registro ${titulo} eliminado`;
            }
        }

        const noticias = await this._noticiaService.buscar();

        response.render(
            'inicio',
            {
                usuario: 'Adrian',
                arreglo: noticias, // AQUI!
                booleano: false,
                mensaje: mensaje
            }
        );
    }

    @Post('eliminar/:idNoticia')
    eliminar(
        @Res() response,
        @Param('idNoticia') idNoticia: string,
    ) {

        const noticiaBorrada = this._noticiaService
            .eliminar(Number(idNoticia));

        const parametrosConsulta = `?accion=borrar&titulo=${
            noticiaBorrada.titulo
            }`;

        response.redirect('/noticia/inicio' + parametrosConsulta)
    }

    @Get('crear-noticia')
    crearNoticiaRuta(
        @Res() response
    ) {
        response.render(
            'crear-noticia'
        )
    }

    @Post('crear-noticia')
    async crearNoticiaFuncion(
        @Res() response,
        @Body() noticia: Noticia
    ) {
        const respuesta = await this._noticiaService.crear(noticia);
        console.log(respuesta);

        response.redirect(
            '/noticia/inicio'
        )
    }

    @Get('actualizar-noticia/:idNoticia')
    async actualizarNoticiaVista(
        @Res() response,
        @Param('idNoticia') idNoticia: string,
    ) {
        // El "+" le transforma en numero a un string
        // numerico
        const noticiaEncontrada = await this._noticiaService
            .buscarPorId(+idNoticia);

        response
            .render(
                'crear-noticia',
                {
                    noticia: noticiaEncontrada
                }
            )


    }

    @Post('actualizar-noticia/:idNoticia')
    async actualizarNoticiaMetedo(
        @Res() response,
        @Param('idNoticia') idNoticia: string,
        @Body() noticia: Noticia
    ) {
        noticia.id = +idNoticia;
        await this._noticiaService.actualizar(noticia);

        response.redirect('/noticia/inicio');

    }
}








