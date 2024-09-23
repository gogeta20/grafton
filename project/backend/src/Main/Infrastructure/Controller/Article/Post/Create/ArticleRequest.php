<?php

declare(strict_types=1);

namespace App\Main\Infrastructure\Controller\Article\Post\Create;

use App\Main\Infrastructure\Request\StandardRequest;
use Symfony\Component\Validator\Constraints as Assert;

class ArticleRequest extends StandardRequest
{
    protected function constraints(): Assert\Collection
    {
        return new Assert\Collection([
            'fields' => [
                'title' => [
                    new Assert\NotBlank(),
                    new Assert\Length(['min' => 3, 'max' => 255]),
                ],
                'body' => [
                    new Assert\NotBlank(),
                ],
                'files' => [
                    new Assert\Count(exactly: 1, exactMessage: 'Exactly one file expected'),
                    new Assert\All([
                        new Assert\File([
                            'maxSize'   => '20M',
                            'mimeTypes' => ['image/jpeg', 'image/png', 'text/plain', 'application/pdf'],
                        ]),
                    ]),
                ],
            ],
        ]);
    }
}
