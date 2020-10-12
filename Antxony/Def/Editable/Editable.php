<?php
/**
 * definición para x-editable
 */

namespace Antxony\Def\Editable;

/**
 * Class Editable
 * @package Antxony\Def\Editable
 * @author Antxony <dantonyofcarim@gmail.com>
 */
class Editable
{
    /**
     * Nombre del campo
     * @var string
     */
    public $name;

    /**
     * Valor del campo
     * @var mixed
     */
    public $value;

    /**
     * Editable constructor.
     * @param array $content
     */
    public function __construct(array $content)
    {
        $this->name = (string)$content['name'];
        $this->value = $content['value'];
    }
}
