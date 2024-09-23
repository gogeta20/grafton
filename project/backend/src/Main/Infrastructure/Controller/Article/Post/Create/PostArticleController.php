<?php

declare(strict_types=1);

namespace App\Main\Infrastructure\Controller\Article\Post\Create;

use App\Main\Application\UseCases\Command\Article\Create\CreateArticleCommand;
use App\Main\Domain\Exception\StoreException;
use App\Main\Infrastructure\Response\JsonApiResponse;
use App\Shared\Application\AppConstants;
use App\Shared\Infrastructure\Symfony\ApiControllerUploads;
use Exception;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;

class PostArticleController extends ApiControllerUploads
{
    /**
     * @throws StoreException
     */
    public function __invoke(ArticleRequest $request, Request $httpRequest): JsonResponse
    {
        $errors = $request->validate();

        if (null !== $errors) {
            return JsonApiResponse::error(errors: $errors);
        }

        $email = $this->decoderService->getUserFromToken($httpRequest);

        try {
            $file = $httpRequest->files->get('files');
            $mediaUrl = null;

            if ($file) {
                $mediaUrl = $this->fileUploader->upload($file, 'public/uploads');
                $mediaUrl = str_replace('public/uploads/', 'uploads/', $mediaUrl);
            }
            $this->dispatch(CreateArticleCommand::create([
                'email' => $email,
                'title' => $request->data()['title'],
                'body' => $request->data()['body'],
                'mediaUrl' => $mediaUrl,
                'mediaType' => $file ? $file->getClientMimeType() : null,
            ]));

        } catch (Exception $exception) {
            throw new StoreException('Error al crear el artículo: ' . $exception->getMessage());
        }

        return JsonApiResponse::created($this->translator->translate(AppConstants::SUCCESS, [], 'basic'));
    }

    protected function exceptions(): array
    {
        return [
            StoreException::class => 500,
            Exception::class => 503,
        ];
    }
}
