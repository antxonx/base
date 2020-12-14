<?php
/**
 * X-Editable type of request
 */

namespace Antxony\Def\Editable;

/**
 * Editable Class for X-Editable request
 * @package Antxony\Def\Editable
 * @author Antxony <dantonyofcarim@gmail.com>
 */
class Editable
{
    /**
     * Primary key
     *
     * @var int
     */
    public $pk;

    /**
     * Field name
     *
     * @var string
     */
    public $name;

    /**
     * new Field value
     * @var mixed
     */
    public $value;

    /**
     * Editable constructor
     *
     * @param array $content
     */
    public function __construct(array $content)
    {
        $this->name = (string)$content['name'];
        $this->value = $content['value'];
        $this->pk = (int)$content['pk'];
    }
}
