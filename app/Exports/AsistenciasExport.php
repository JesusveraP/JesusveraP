<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class AsistenciasExport implements FromArray, WithHeadings, WithStyles
{
    protected $datos;

    public function __construct($datos = [])
    {
        $this->datos = $datos;
    }

    public function array(): array
    {
        return $this->datos;
    }

    public function headings(): array
    {
        return [
            'Instructor',
            'Área/Materia',
            'Fecha',
            'Hora Entrada',
            'Hora Salida',
            'Horas Trabajadas',
            'Estado',
            'Observaciones'
        ];
    }

    public function styles($sheet)
    {
        // Estilos para encabezados
        $sheet->getStyle('A1:H1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 12,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '4CAF50'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
                'wrapText' => true,
            ],
        ]);

        // Estilos para datos
        $highestRow = $sheet->getHighestRow();
        if ($highestRow > 1) {
            $sheet->getStyle('A2:H' . $highestRow)->applyFromArray([
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_LEFT,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ]);

            // Alternar colores de fila
            for ($row = 2; $row <= $highestRow; $row++) {
                if ($row % 2 == 0) {
                    $sheet->getStyle('A' . $row . ':H' . $row)->getFill()
                        ->setFillType(Fill::FILL_SOLID)
                        ->getStartColor()
                        ->setRGB('F5F5F5');
                }
            }
        }

        // Ajustar ancho de columnas
        $sheet->getColumnDimension('A')->setWidth(25);
        $sheet->getColumnDimension('B')->setWidth(20);
        $sheet->getColumnDimension('C')->setWidth(15);
        $sheet->getColumnDimension('D')->setWidth(15);
        $sheet->getColumnDimension('E')->setWidth(15);
        $sheet->getColumnDimension('F')->setWidth(18);
        $sheet->getColumnDimension('G')->setWidth(15);
        $sheet->getColumnDimension('H')->setWidth(30);

        // Congelar encabezados
        $sheet->freezePane('A2');

        return [];
    }
}
