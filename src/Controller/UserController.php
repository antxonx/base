<?php
/**
 * Rutas para usuarios
 */

namespace App\Controller;

use Antxony\Def\Editable\Editable;
use App\Entity\User;
use Antxony\Util;
use Exception;
use Doctrine\ORM\ORMException;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\IsGranted;
use App\Repository\UserRepository;
use Doctrine\DBAL\Exception\UniqueConstraintViolationException;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

/**
 * Usuarios
 * @Route("/user")
 * @author Antxony <dantonyofcarim@gmail.com>
 */
class UserController extends AbstractController
{
    /**
     * Repositorio de usuarios
     *
     * @var UserRepository
     */
    protected $rep;

    /**
     * Usuario actual
     *
     * @var User
     */
    protected $actualUser;

    /**
     * password encoder
     *
     * @var UserPasswordEncoderInterface
     */
    protected $passwordEncoder;

    /**
     * herramientas útiles
     *
     * @var Util
     */
    protected $util;

    /**
     * Constructor
     *
     * @param UserRepository $rep
     * @param Security $security
     * @param UserPasswordEncoderInterface $passwordEncoder
     * @param Util $util
     */
    public function __construct(UserRepository $rep, Security $security, UserPasswordEncoderInterface $passwordEncoder, Util $util)
    {
        $this->actualUser = $security->getUser();
        $this->util = $util;
        $this->rep = $rep;
        $this->passwordEncoder = $passwordEncoder;
    }

    /**
     * Inicio
     * @Route("/", name="user_index", methods={"GET"})
     * @IsGranted("ROLE_ADMIN")
     *
     * @return Response
     */
    public function index(): Response
    {
        return $this->render('view/user/index.html.twig', [
            'controller_name' => 'UserController',
        ]);
    }

    /**
     * Conseguir todos los usuarios
     * @Route("/list", name="user_list", methods={"GET"})
     * @IsGranted("ROLE_ADMIN")
     *
     * @param Request $request
     * @return Response
     */
    public function indexA(Request $request): Response
    {
        try {
            $params = json_decode(json_encode($request->query->all()));
            $result = $this->rep->getBy($params);
            $showed = ((isset($params->page)) ? $params->page * $this->util::PAGE_COUNT : $this->util::PAGE_COUNT);
            $users = $result['paginator'];
            $maxPages = ceil($users->count() / $this->util::PAGE_COUNT);
            return $this->render("view/user/tbody.html.twig", [
                'users' => $users,
                'maxPages' => $maxPages,
                'thisPage' => ((isset($params->page)) ? $params->page : 1),
                'showed' => (($showed > $users->count()) ? $users->count() : $showed),
            ]);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Cargar formulario de usuarios
     * @Route("/form", name="user_form", methods={"GET"})
     * @IsGranted("ROLE_ADMIN")
     *
     * @return Response
     */
    public function form(): Response
    {
        try {
            return $this->render("view/user/form.html.twig");
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Formulario de cambio de contraseña
     * @Route("/key", name="user_key", methods={"GET"})
     * @IsGranted("ROLE_ADMIN")
     *
     * @return Response
     */
    public function key(): Response
    {
        try {
            return $this->render("view/user/key.html.twig");
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Cambiar contraseña
     * @Route("/key/{id}", name="user_key_update", methods={"PATCH"})
     * @IsGranted("ROLE_ADMIN")
     *
     * @param integer $id
     * @param Request $request
     * @return Response
     */
    public function keyUpdate(int $id, Request $request): Response
    {
        try {
            $content = json_decode($request->getContent());
            $user = $this->rep->find($id);
            $user->setPassword($this->passwordEncoder->encodePassword($user, $content->password));
            $this->rep->update();
            $this->util->info("Se ha acutalizado la contraseña del usuario {$user->getId()}");
            return new Response("Se ha actualizado la contraseña");
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Formulario de cambio de contraseña
     * @Route("/reactivate/{id}", name="user_reactivate", methods={"PATCH"})
     * @IsGranted("ROLE_ADMIN")
     *
     * @param integer $id
     * @return Response
     */
    public function reactivate(int $id): Response
    {
        try {
            $user = $this->rep->find($id);
            $user->setSuspended(false);
            $this->rep->update();
            $this->util->info("Se ha reactivado al usuario {$id}");
            return new Response("Usuario reactivado");
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Cargar formulario de cambio de contraseña
     * @Route("/profile/pass", name="user_profile_pass_form", methods={"GET"})
     *
     * @return Response
     */
    public function passform(): Response
    {
        try {
            return $this->render('view/user/passform.html.twig');
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Cambiar contraseña del usuario
     * @Route("/profile/pass", name="user_profile_pass_change", methods={"PUT"})
     * @param Request $request
     *
     * @return Response
     */
    public function passchange(Request $request): Response
    {
        try {
            $content = json_decode($request->getContent());
            if (!$this->passwordEncoder->isPasswordValid($this->actualUser, $content->old)) {
                throw new Exception("La contraseña actual es incorrecta");
            }
            if ($content->new != $content->conf) {
                throw new Exception("Las contraseñas no coinciden");
            }
            $this->rep->upgradePassword($this->actualUser,  $this->passwordEncoder->encodePassword(
                $this->actualUser,
                $content->new
            ));
            return new Response("Contraseña actualizada");
        } catch (ORMException $e) {
            return $this->util->errorResponse($e);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Mostrar perfil de usuario
     * @Route("/profile", name="user_profile", methods={"GET"})
     *
     * @return Response
     */
    public function profile(): Response
    {
        try {
            return $this->render("view/user/profile.html.twig", [
                // 'user' => $user
            ]);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Mostrar a un usuario
     * @Route("/{id}", name="user_edit", methods={"GET"})
     * @IsGranted("ROLE_ADMIN")
     *
     * @param integer $id
     * @return Response
     */
    public function edit(int $id): Response
    {
        try {
            $user = $this->rep->find($id);
            if ($user == null) {
                throw new Exception("No se ha encontrado el usuario");
            }
            return $this->render("view/user/edit.html.twig", [
                'user' => $user
            ]);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Agregar a un usuario
     * @Route("/", name="user_add", methods={"POST"})
     * @IsGranted("ROLE_ADMIN")
     *
     * @param Request $request
     * @return Response
     */
    public function add(Request $request): Response
    {
        $content = json_decode($request->getContent());
        try {
            $user = new User();
            $user->setUsername($content->username)
                ->setMail($content->email)
                ->setName($content->name)
                ->setPassword(
                    $this->passwordEncoder->encodePassword(
                        $user,
                        $content->password
                    )
                )
                ->setRoles($content->roles)
                ->setSuspended(false);
            $this->rep->add($user);
            $this->util->info("Se ha agregado al usuario {$user->getId()}");
            return new Response("Usuario agregado");
        } /** @noinspection PhpRedundantCatchClauseInspection */ catch (UniqueConstraintViolationException $e) {

            if ($this->util->containsString($e->getMessage(), User::FK_USERNAME)) {
                $message = "El usuario <b>{$content->username}</b> ya existe.";
            } elseif ($this->util->containsString($e->getMessage(), User::FK_MAIL)) {
                $message = "El correo <b>{$content->email}</b> ya está en uso.";
            } else {
                $message = $e->getMessage();
            }
            $this->util->errorException($e);
            return new Response($message, Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Actualizar usuario con x-editable
     * @Route("/{id}", name="user_update", methods={"PUT", "PATCH"})
     * @IsGranted("IS_AUTHENTICATED_FULLY")
     *
     * @param integer $id
     * @param Request $request
     * @return Response
     */
    public function update(Request $request, int $id = 0): Response
    {
        parse_str($request->getContent(), $content);
        $content = new Editable($content);
        try {
            $user = $this->actualUser;
            if ($id > 0) {
                if ($this->actualUser->hasRole("ROLE_ADMIN")) {
                    $user = $this->rep->find($id);
                } else {
                    throw new Exception("Permiso denegado");
                }
            }
            $message = "Se ha actualizado";
            if ($content->name == "username") {
                $user->setUsername($content->value);
                $message .= " el nombre de usuario";
            }
            if ($content->name == "email") {
                $user->setMail($content->value);
                $message .= " el correo";
            }
            if ($content->name == "name") {
                $user->setName($content->value);
                $message .= " el nombre";
            }
            if ($content->name == "roles") {
                if (!$this->actualUser->hasRole("ROLE_ADMIN")) {
                    throw new Exception("Permiso denegado");
                }
                $user->setRoles($content->value);
                $message .= " el rol";
            }
            $this->rep->update();
            $this->util->info($message . " del usuario {$user->getId()}");
            return new response($message);
        } /** @noinspection PhpRedundantCatchClauseInspection */ catch (UniqueConstraintViolationException $e) {
            if ($this->util->containsString($e->getMessage(), User::FK_USERNAME)) {
                $message = "El usuario <b>{$content->value}</b> ya existe.";
            } elseif ($this->util->containsString($e->getMessage(), User::FK_MAIL)) {
                $message = "El correo <b>{$content->value}</b> ya está en uso.";
            } else {
                $message = $e->getMessage();
            }
            $this->util->errorException($e);
            return new Response($message, Response::HTTP_INTERNAL_SERVER_ERROR);
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Eliminar/Suspender a un usuario
     * @Route("/{id}", name="user_delete", methods={"DELETE"})
     * @IsGranted("ROLE_ADMIN")
     *
     * @param integer $id
     * @return Response
     */
    public function delete(int $id): Response
    {
        try {
            $user = $this->rep->find($id);
            if ($user->hasRole("ROLE_GOD")) {
                throw new Exception("No se puede eliminar a Dios");
            } else {
                $user->setSuspended(true)
                    ->setPassword(
                        $this->passwordEncoder->encodePassword(
                            $user,
                            $this->util->generateRandomString(10)
                        )
                    );
            }
            $this->rep->update();
            $this->util->info("Se ha suspendido al usuario {$id}");
            return new Response("Usuario suspendido");
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }

    /**
     * Cambiar contraseña de usuario suspendido
     * @Route("/reSuspend/{id}", name="user_resuspend", methods={"POST"})
     *
     * @param int $id
     * @return Response
     */
    public function changeSuspendedPassword(int $id)
    {
        try {
            $user = $this->rep->find($id);
            if(!$user->getSuspended()){
                throw new Exception("Este usuario no ha sido suspendido.");
            }
            $user->setPassword(
                    $this->passwordEncoder->encodePassword(
                        $user,
                        $this->util->generateRandomString(10)
                    )
                );
            $this->rep->update();
            $this->util->info("Se ha <b>re</b>-suspendido al usuario {$id}");
            return new Response("ok");
        } catch (Exception $e) {
            return $this->util->errorResponse($e);
        }
    }
}
